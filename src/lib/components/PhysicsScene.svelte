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
		camera.position.set(0, 0, 40);

		// Soft lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
		scene.add(ambientLight);
		const dirLight = new THREE.DirectionalLight(0xd5ede0, 0.6);
		dirLight.position.set(5, 12, 8);
		scene.add(dirLight);
		const rimLight = new THREE.DirectionalLight(0xe8d5f5, 0.25);
		rimLight.position.set(-8, -4, 6);
		scene.add(rimLight);

		// Zero gravity — spring-held
		const gravity = new RAPIER.Vector3(0.0, 0.0, 0.0);
		const world = new RAPIER.World(gravity);

		// Palette
		const colorArr = [
			new THREE.Color(0xa882c8),
			new THREE.Color(0x82be9e),
			new THREE.Color(0xc8af82),
			new THREE.Color(0x82a0c8),
			new THREE.Color(0xc882a0),
			new THREE.Color(0x6b8a6f),
			new THREE.Color(0xe8dcc8),
		];

		// ── Mushroom geometry builders ──

		function createMushroom(color: THREE.Color, variant: number): THREE.Group {
			const group = new THREE.Group();
			const mat = new THREE.MeshPhysicalMaterial({
				color,
				transparent: true,
				opacity: 0.18,
				roughness: 0.75,
				metalness: 0.02,
				transmission: 0.2,
				side: THREE.DoubleSide,
			});
			const stemMat = () => {
				const m = mat.clone();
				m.opacity = 0.12;
				return m;
			};

			if (variant === 0) {
				// Rounded cap
				const cap = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), mat);
				group.add(cap);
				const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.2, 10), stemMat());
				stem.position.y = -0.5;
				group.add(stem);
			} else if (variant === 1) {
				// Parasol
				const cap = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.4, 20), mat);
				group.add(cap);
				const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 1.6, 8), stemMat());
				stem.position.y = -0.7;
				group.add(stem);
			} else if (variant === 2) {
				// Liberty cap
				const cap = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.9, 14), mat);
				group.add(cap);
				const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 2.0, 8), stemMat());
				stem.position.y = -0.9;
				group.add(stem);
			} else if (variant === 3) {
				// Small cluster
				for (let j = 0; j < 3; j++) {
					const angle = (j / 3) * Math.PI * 2;
					const r = 0.3;
					const smallCap = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), mat.clone());
					smallCap.position.set(Math.cos(angle) * r, 0.1 * j, Math.sin(angle) * r);
					smallCap.scale.setScalar(0.7 + j * 0.15);
					group.add(smallCap);
					const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.6 + j * 0.2, 6), stemMat());
					stem.position.set(Math.cos(angle) * r, -0.3 - j * 0.08, Math.sin(angle) * r);
					group.add(stem);
				}
			} else {
				// Portobello
				const cap = new THREE.Mesh(new THREE.SphereGeometry(1.3, 22, 10, 0, Math.PI * 2, 0, Math.PI * 0.35), mat);
				group.add(cap);
				const gills = new THREE.Mesh(
					new THREE.RingGeometry(0.15, 1.15, 24),
					new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity: 0.06, side: THREE.DoubleSide, roughness: 0.9 })
				);
				gills.rotation.x = -Math.PI / 2;
				gills.position.y = -0.05;
				group.add(gills);
				const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 0.9, 10), stemMat());
				stem.position.y = -0.4;
				group.add(stem);
			}

			return group;
		}

		// ── Place mushrooms along LEFT and RIGHT margins only ──

		interface Mushroom {
			group: THREE.Group;
			body: InstanceType<typeof RAPIER.RigidBody>;
			restPos: THREE.Vector3;
			colorIdx: number;
		}

		const mushrooms: Mushroom[] = [];
		const positions: THREE.Vector3[] = [];

		// Aspect-aware bounds
		const vFov = (camera.fov * Math.PI) / 180;
		const dist = camera.position.z;
		const viewH = 2 * Math.tan(vFov / 2) * dist;
		const viewW = viewH * camera.aspect;

		// Place mushrooms along left and right edges, scattered vertically
		const SIDE_COUNT = 9; // per side
		const edgeInset = 2.5; // how far from the very edge

		for (let side = 0; side < 2; side++) {
			const xSign = side === 0 ? -1 : 1;
			const baseX = xSign * (viewW / 2 - edgeInset);

			for (let i = 0; i < SIDE_COUNT; i++) {
				// Spread vertically across the full page view with jitter
				const t = (i / (SIDE_COUNT - 1)) * 2 - 1; // -1 to 1
				const y = t * (viewH / 2 - 2) + (Math.random() - 0.5) * 3;
				const x = baseX + (Math.random() - 0.5) * 4;
				const z = -3 + (Math.random() - 0.5) * 8;
				positions.push(new THREE.Vector3(x, y, z));
			}
		}

		const NUM = positions.length;

		for (let i = 0; i < NUM; i++) {
			const variant = i % 5;
			const colorIdx = i % colorArr.length;
			const pos = positions[i];
			const scale = 0.5 + Math.random() * 0.7;

			const group = createMushroom(colorArr[colorIdx], variant);
			group.scale.setScalar(scale);

			// Random orientations — tilted at various angles, NOT all facing down
			group.rotation.x = (Math.random() - 0.5) * Math.PI * 0.8;
			group.rotation.y = Math.random() * Math.PI * 2;
			group.rotation.z = (Math.random() - 0.5) * Math.PI * 0.6;

			scene.add(group);

			const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
				.setTranslation(pos.x, pos.y, pos.z)
				.setLinearDamping(5.0)
				.setAngularDamping(4.0);
			const body = world.createRigidBody(bodyDesc);

			const colliderDesc = RAPIER.ColliderDesc.ball(0.6 * scale)
				.setRestitution(0.2)
				.setDensity(0.5);
			world.createCollider(colliderDesc, body);

			// Store initial rotation
			group.userData.restRotX = group.rotation.x;
			group.userData.restRotY = group.rotation.y;
			group.userData.restRotZ = group.rotation.z;

			mushrooms.push({ group, body, restPos: pos.clone(), colorIdx });
		}

		// ── Mycelium connections between nearby mushrooms on same side ──

		interface Connection {
			i: number;
			j: number;
			line: THREE.Line;
		}

		const connections: Connection[] = [];

		for (let i = 0; i < NUM; i++) {
			for (let j = i + 1; j < NUM; j++) {
				// Only connect mushrooms on the same side
				const sameLeft = positions[i].x < 0 && positions[j].x < 0;
				const sameRight = positions[i].x > 0 && positions[j].x > 0;
				if (!sameLeft && !sameRight) continue;

				const d = positions[i].distanceTo(positions[j]);
				if (d < 10) {
					const geo = new THREE.BufferGeometry().setFromPoints([positions[i], positions[j]]);
					const mixColor = colorArr[mushrooms[i].colorIdx].clone().lerp(colorArr[mushrooms[j].colorIdx], 0.5);
					const mat = new THREE.LineBasicMaterial({ color: mixColor, transparent: true, opacity: 0.04 });
					const line = new THREE.Line(geo, mat);
					scene.add(line);
					connections.push({ i, j, line });
				}
			}
		}

		// Mouse
		const mouseWorld = new THREE.Vector3(9999, 9999, 0);
		const mouseNdc = new THREE.Vector2(9999, 9999);
		const raycaster = new THREE.Raycaster();
		const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 3);

		const handleMouseMove = (e: MouseEvent) => {
			mouseNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
			mouseNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
			raycaster.setFromCamera(mouseNdc, camera);
			raycaster.ray.intersectPlane(plane, mouseWorld);
		};
		window.addEventListener('mousemove', handleMouseMove);

		const handleMouseLeave = () => mouseWorld.set(9999, 9999, 0);
		window.addEventListener('mouseleave', handleMouseLeave);

		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', handleResize);

		// Scroll tracking — velocity + per-mushroom delayed reaction
		let scrollY = window.scrollY;
		let scrollVelocity = 0;
		let scrollImpulses: number[] = new Array(NUM).fill(0);

		const handleScroll = () => {
			const newScrollY = window.scrollY;
			const delta = newScrollY - scrollY;
			scrollVelocity = delta;
			scrollY = newScrollY;

			// Cascade: each mushroom gets the impulse with a delay based on its
			// vertical rest position. Top mushrooms react first on downscroll,
			// bottom mushrooms react first on upscroll.
			const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
			const scrollProgress = pageHeight > 0 ? newScrollY / pageHeight : 0;

			for (let i = 0; i < NUM; i++) {
				// Normalize rest Y position to 0..1 (top to bottom)
				const normalizedY = 1 - ((mushrooms[i].restPos.y + viewH / 2) / viewH);
				// Delay: mushrooms closer to scroll direction react sooner
				const proximity = delta > 0
					? 1 - Math.abs(normalizedY - scrollProgress) // downscroll: near viewport top reacts more
					: 1 - Math.abs(normalizedY - scrollProgress);
				const strength = delta * 0.15 * Math.max(0, proximity + 0.3);
				scrollImpulses[i] += strength;
			}
		};
		window.addEventListener('scroll', handleScroll, { passive: true });

		const clock = new THREE.Clock();
		const tmpVec = new RAPIER.Vector3(0, 0, 0);

		function animate() {
			animId = requestAnimationFrame(animate);
			const elapsed = clock.getElapsedTime();

			for (let i = 0; i < mushrooms.length; i++) {
				const { body, restPos } = mushrooms[i];
				const pos = body.translation();

				// Spring to rest
				const springK = 0.12;
				tmpVec.x = (restPos.x - pos.x) * springK;
				tmpVec.y = (restPos.y - pos.y) * springK;
				tmpVec.z = (restPos.z - pos.z) * springK;

				// Very gentle breathing drift
				const phase = elapsed * 0.3 + i * 1.3;
				tmpVec.x += Math.sin(phase) * 0.004;
				tmpVec.y += Math.cos(phase * 0.6) * 0.005;

				// Scroll impulse — sway sideways + nudge vertically
				if (Math.abs(scrollImpulses[i]) > 0.01) {
					const si = scrollImpulses[i];
					// Lateral sway (alternate direction per mushroom)
					const sway = (i % 2 === 0 ? 1 : -1) * si * 0.012;
					tmpVec.x += sway;
					// Vertical nudge in scroll direction
					tmpVec.y -= si * 0.008;
					// Rotational wiggle via torque
					body.applyTorqueImpulse(
						new RAPIER.Vector3(
							si * 0.003 * (i % 3 === 0 ? -1 : 1),
							0,
							si * 0.005 * (i % 2 === 0 ? 1 : -1)
						),
						true
					);
					// Decay the stored impulse
					scrollImpulses[i] *= 0.85;
				}

				// Mouse push
				const mx = pos.x - mouseWorld.x;
				const my = pos.y - mouseWorld.y;
				const mDist = Math.sqrt(mx * mx + my * my);
				if (mDist < 5) {
					const push = 0.06 * (1 - mDist / 5);
					tmpVec.x += (mx / mDist) * push;
					tmpVec.y += (my / mDist) * push;
				}

				body.applyImpulse(tmpVec, true);
			}

			world.step();

			// Sync meshes
			for (let i = 0; i < mushrooms.length; i++) {
				const { group, body } = mushrooms[i];
				const pos = body.translation();
				group.position.set(pos.x, pos.y, pos.z);

				// Keep initial rotation but add very slow wobble
				const wobble = elapsed * 0.15 + i * 0.9;
				group.rotation.x = (group.userData.restRotX ?? 0) + Math.sin(wobble) * 0.04;
				group.rotation.z = (group.userData.restRotZ ?? 0) + Math.cos(wobble * 0.7) * 0.03;

				// Breathing scale
				const baseScale = group.userData.baseScale ?? group.scale.x;
				if (!group.userData.baseScale) group.userData.baseScale = baseScale;
				group.scale.setScalar(baseScale * (1.0 + Math.sin(elapsed * 0.5 + i * 0.8) * 0.02));
			}

			// Update lines
			for (const conn of connections) {
				const posA = mushrooms[conn.i].body.translation();
				const posB = mushrooms[conn.j].body.translation();
				const attr = conn.line.geometry.attributes.position as THREE.BufferAttribute;
				attr.setXYZ(0, posA.x, posA.y, posA.z);
				attr.setXYZ(1, posB.x, posB.y, posB.z);
				attr.needsUpdate = true;

				const midX = (posA.x + posB.x) / 2;
				const midY = (posA.y + posB.y) / 2;
				const mDist = Math.sqrt((midX - mouseWorld.x) ** 2 + (midY - mouseWorld.y) ** 2);
				const mat = conn.line.material as THREE.LineBasicMaterial;
				mat.opacity = mDist < 7 ? 0.04 + (1 - mDist / 7) * 0.1 : 0.03 + Math.sin(elapsed * 0.2 + conn.i) * 0.01;
			}

			// Very subtle camera sway
			camera.position.x = Math.sin(elapsed * 0.05) * 0.4;
			camera.position.y = Math.cos(elapsed * 0.04) * 0.3;
			camera.lookAt(0, 0, -3);

			renderer.render(scene, camera);
		}

		animate();

		return () => {
			window.removeEventListener('scroll', handleScroll);
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
