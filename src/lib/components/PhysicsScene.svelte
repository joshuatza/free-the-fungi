<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	let canvas: HTMLCanvasElement;
	let animId: number;

	onMount(async () => {
		const RAPIER = await import('@dimforge/rapier3d-compat');
		await RAPIER.init();

		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(window.innerWidth, window.innerHeight);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 120);
		camera.position.set(0, 0, 35);

		// Soft, warm lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);
		const dirLight = new THREE.DirectionalLight(0xd5ede0, 0.7);
		dirLight.position.set(5, 12, 8);
		scene.add(dirLight);
		const rimLight = new THREE.DirectionalLight(0xe8d5f5, 0.3);
		rimLight.position.set(-8, -4, 6);
		scene.add(rimLight);

		// Rapier world — near-zero gravity, everything held by spring joints
		const gravity = new RAPIER.Vector3(0.0, 0.0, 0.0);
		const world = new RAPIER.World(gravity);

		// Palette
		const palette = {
			purple: new THREE.Color(0xa882c8),
			green: new THREE.Color(0x82be9e),
			gold: new THREE.Color(0xc8af82),
			blue: new THREE.Color(0x82a0c8),
			pink: new THREE.Color(0xc882a0),
			sage: new THREE.Color(0x6b8a6f),
			cream: new THREE.Color(0xe8dcc8),
		};
		const colorArr = Object.values(palette);

		// ── Mushroom geometry builders ──

		function createCapMesh(color: THREE.Color, variant: number): THREE.Group {
			const group = new THREE.Group();
			const mat = new THREE.MeshPhysicalMaterial({
				color,
				transparent: true,
				opacity: 0.35,
				roughness: 0.7,
				metalness: 0.05,
				transmission: 0.15,
				side: THREE.DoubleSide,
			});

			if (variant === 0) {
				// Classic rounded cap
				const cap = new THREE.Mesh(
					new THREE.SphereGeometry(1, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55),
					mat
				);
				cap.rotation.x = Math.PI;
				group.add(cap);
				// Stem
				const stem = new THREE.Mesh(
					new THREE.CylinderGeometry(0.12, 0.18, 1.2, 10),
					mat.clone()
				);
				(stem.material as THREE.MeshPhysicalMaterial).opacity = 0.25;
				stem.position.y = 0.5;
				group.add(stem);
			} else if (variant === 1) {
				// Flat parasol cap
				const cap = new THREE.Mesh(
					new THREE.ConeGeometry(1.1, 0.4, 20),
					mat
				);
				cap.rotation.x = Math.PI;
				group.add(cap);
				const stem = new THREE.Mesh(
					new THREE.CylinderGeometry(0.08, 0.14, 1.6, 8),
					mat.clone()
				);
				(stem.material as THREE.MeshPhysicalMaterial).opacity = 0.22;
				stem.position.y = 0.7;
				group.add(stem);
			} else if (variant === 2) {
				// Tall skinny (liberty cap style)
				const cap = new THREE.Mesh(
					new THREE.ConeGeometry(0.5, 0.9, 14),
					mat
				);
				cap.rotation.x = Math.PI;
				group.add(cap);
				const stem = new THREE.Mesh(
					new THREE.CylinderGeometry(0.06, 0.1, 2.0, 8),
					mat.clone()
				);
				(stem.material as THREE.MeshPhysicalMaterial).opacity = 0.2;
				stem.position.y = 0.9;
				group.add(stem);
			} else if (variant === 3) {
				// Bulbous cluster (2-3 small caps)
				for (let j = 0; j < 3; j++) {
					const angle = (j / 3) * Math.PI * 2;
					const r = 0.3;
					const smallCap = new THREE.Mesh(
						new THREE.SphereGeometry(0.45, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5),
						mat.clone()
					);
					smallCap.rotation.x = Math.PI;
					smallCap.position.set(Math.cos(angle) * r, -0.1 * j, Math.sin(angle) * r);
					smallCap.scale.setScalar(0.7 + j * 0.2);
					group.add(smallCap);
					const stem = new THREE.Mesh(
						new THREE.CylinderGeometry(0.05, 0.08, 0.7 + j * 0.3, 6),
						mat.clone()
					);
					(stem.material as THREE.MeshPhysicalMaterial).opacity = 0.18;
					stem.position.set(Math.cos(angle) * r, 0.3 + j * 0.1, Math.sin(angle) * r);
					group.add(stem);
				}
			} else {
				// Wide flat cap (portobello style)
				const cap = new THREE.Mesh(
					new THREE.SphereGeometry(1.3, 22, 10, 0, Math.PI * 2, 0, Math.PI * 0.35),
					mat
				);
				cap.rotation.x = Math.PI;
				group.add(cap);
				// Gills — thin disc underneath
				const gills = new THREE.Mesh(
					new THREE.RingGeometry(0.15, 1.15, 24),
					new THREE.MeshPhysicalMaterial({
						color,
						transparent: true,
						opacity: 0.12,
						side: THREE.DoubleSide,
						roughness: 0.9,
					})
				);
				gills.rotation.x = Math.PI / 2;
				gills.position.y = 0.05;
				group.add(gills);
				const stem = new THREE.Mesh(
					new THREE.CylinderGeometry(0.18, 0.25, 0.9, 10),
					mat.clone()
				);
				(stem.material as THREE.MeshPhysicalMaterial).opacity = 0.22;
				stem.position.y = 0.4;
				group.add(stem);
			}

			return group;
		}

		// ── Place mushrooms in a connected network ──

		interface Mushroom {
			group: THREE.Group;
			body: InstanceType<typeof RAPIER.RigidBody>;
			restPos: THREE.Vector3;
			colorIdx: number;
		}

		const mushrooms: Mushroom[] = [];
		const NUM = 28;

		// Generate positions in a spread-out organic grid
		const positions: THREE.Vector3[] = [];
		const spacing = 5.5;
		const cols = 7;
		for (let i = 0; i < NUM; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);
			const x = (col - (cols - 1) / 2) * spacing + (Math.random() - 0.5) * 2.5;
			const y = (row - 1.5) * spacing + (Math.random() - 0.5) * 2.5;
			const z = (Math.random() - 0.5) * 6 - 4;
			positions.push(new THREE.Vector3(x, y, z));
		}

		for (let i = 0; i < NUM; i++) {
			const variant = i % 5;
			const colorIdx = i % colorArr.length;
			const pos = positions[i];
			const scale = 0.6 + Math.random() * 0.8;

			const group = createCapMesh(colorArr[colorIdx], variant);
			group.scale.setScalar(scale);
			// Random initial rotation for variety
			group.rotation.z = (Math.random() - 0.5) * 0.4;
			group.rotation.x = (Math.random() - 0.5) * 0.3;
			scene.add(group);

			const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
				.setTranslation(pos.x, pos.y, pos.z)
				.setLinearDamping(4.0)
				.setAngularDamping(3.0);
			const body = world.createRigidBody(bodyDesc);

			const colliderDesc = RAPIER.ColliderDesc.ball(0.8 * scale)
				.setRestitution(0.2)
				.setDensity(0.5);
			world.createCollider(colliderDesc, body);

			mushrooms.push({ group, body, restPos: pos.clone(), colorIdx });
		}

		// ── Mycelium connections (lines between nearby mushrooms) ──

		interface Connection {
			i: number;
			j: number;
			line: THREE.Line;
		}

		const connections: Connection[] = [];
		const connectionThreshold = 9.0;

		for (let i = 0; i < NUM; i++) {
			for (let j = i + 1; j < NUM; j++) {
				const d = positions[i].distanceTo(positions[j]);
				if (d < connectionThreshold) {
					const geo = new THREE.BufferGeometry().setFromPoints([
						positions[i],
						positions[j],
					]);
					const mixColor = colorArr[mushrooms[i].colorIdx]
						.clone()
						.lerp(colorArr[mushrooms[j].colorIdx], 0.5);
					const mat = new THREE.LineBasicMaterial({
						color: mixColor,
						transparent: true,
						opacity: 0.08,
					});
					const line = new THREE.Line(geo, mat);
					scene.add(line);
					connections.push({ i, j, line });
				}
			}
		}

		// Mouse
		const mouse = new THREE.Vector2(9999, 9999);
		const mouseWorld = new THREE.Vector3();
		const raycaster = new THREE.Raycaster();

		const handleMouseMove = (e: MouseEvent) => {
			mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
			raycaster.setFromCamera(mouse, camera);
			// Project to z=0 plane
			const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 4);
			raycaster.ray.intersectPlane(plane, mouseWorld);
		};
		window.addEventListener('mousemove', handleMouseMove);

		const handleMouseLeave = () => {
			mouseWorld.set(9999, 9999, 0);
		};
		window.addEventListener('mouseleave', handleMouseLeave);

		// Resize
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', handleResize);

		const clock = new THREE.Clock();
		const tmpVec = new RAPIER.Vector3(0, 0, 0);

		function animate() {
			animId = requestAnimationFrame(animate);
			const elapsed = clock.getElapsedTime();

			// Apply spring forces to keep mushrooms near rest positions + gentle breathing
			for (let i = 0; i < mushrooms.length; i++) {
				const { body, restPos, group } = mushrooms[i];
				const pos = body.translation();

				// Spring force toward rest position
				const dx = restPos.x - pos.x;
				const dy = restPos.y - pos.y;
				const dz = restPos.z - pos.z;
				const springK = 0.15;
				tmpVec.x = dx * springK;
				tmpVec.y = dy * springK;
				tmpVec.z = dz * springK;

				// Gentle breathing oscillation
				const phase = elapsed * 0.4 + i * 1.1;
				tmpVec.x += Math.sin(phase) * 0.008;
				tmpVec.y += Math.cos(phase * 0.7) * 0.01;
				tmpVec.z += Math.sin(phase * 0.5) * 0.005;

				// Mouse influence — gentle push away
				const mx = pos.x - mouseWorld.x;
				const my = pos.y - mouseWorld.y;
				const mDist = Math.sqrt(mx * mx + my * my);
				if (mDist < 6) {
					const pushStrength = 0.08 * (1 - mDist / 6);
					tmpVec.x += (mx / mDist) * pushStrength;
					tmpVec.y += (my / mDist) * pushStrength;
				}

				body.applyImpulse(tmpVec, true);
			}

			world.step();

			// Sync meshes and update connections
			for (let i = 0; i < mushrooms.length; i++) {
				const { group, body } = mushrooms[i];
				const pos = body.translation();
				const rot = body.rotation();
				group.position.set(pos.x, pos.y, pos.z);
				group.quaternion.set(rot.x, rot.y, rot.z, rot.w);

				// Breathing scale
				const breath = 1.0 + Math.sin(elapsed * 0.6 + i * 0.9) * 0.03;
				const baseScale = group.userData.baseScale ?? group.scale.x;
				if (!group.userData.baseScale) group.userData.baseScale = baseScale;
				group.scale.setScalar(baseScale * breath);

				// Breathing opacity
				group.traverse((child) => {
					if ((child as THREE.Mesh).isMesh) {
						const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
						if (mat.opacity !== undefined) {
							const baseOp = mat.userData.baseOpacity ?? mat.opacity;
							if (!mat.userData.baseOpacity) mat.userData.baseOpacity = baseOp;
							mat.opacity = baseOp + Math.sin(elapsed * 0.5 + i * 0.7) * 0.06;
						}
					}
				});
			}

			// Update mycelium lines
			for (const conn of connections) {
				const posA = mushrooms[conn.i].body.translation();
				const posB = mushrooms[conn.j].body.translation();
				const positions = conn.line.geometry.attributes.position;
				(positions as THREE.BufferAttribute).setXYZ(0, posA.x, posA.y, posA.z);
				(positions as THREE.BufferAttribute).setXYZ(1, posB.x, posB.y, posB.z);
				positions.needsUpdate = true;

				// Fade connection based on proximity to mouse
				const midX = (posA.x + posB.x) / 2;
				const midY = (posA.y + posB.y) / 2;
				const mDist = Math.sqrt(
					(midX - mouseWorld.x) ** 2 + (midY - mouseWorld.y) ** 2
				);
				const mat = conn.line.material as THREE.LineBasicMaterial;
				if (mDist < 8) {
					mat.opacity = 0.06 + (1 - mDist / 8) * 0.15;
				} else {
					mat.opacity = 0.06 + Math.sin(elapsed * 0.3 + conn.i) * 0.02;
				}
			}

			// Very subtle camera sway
			camera.position.x = Math.sin(elapsed * 0.06) * 0.8;
			camera.position.y = Math.cos(elapsed * 0.05) * 0.5;
			camera.lookAt(0, 0, -4);

			renderer.render(scene, camera);
		}

		animate();

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseleave', handleMouseLeave);
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animId);
			renderer.dispose();
			world.free();
		};
	});

	onDestroy(() => {
		if (animId) cancelAnimationFrame(animId);
	});
</script>

<canvas bind:this={canvas} class="physics-canvas"></canvas>

<style>
	.physics-canvas {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		width: 100%;
		height: 100%;
	}
</style>
