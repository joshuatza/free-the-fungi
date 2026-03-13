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
		const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
		camera.position.set(0, 0, 20);

		// Soft lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);
		const dirLight = new THREE.DirectionalLight(0xd5ede0, 0.8);
		dirLight.position.set(5, 10, 7);
		scene.add(dirLight);
		const pointLight = new THREE.PointLight(0xe8d5f5, 0.5, 30);
		pointLight.position.set(-5, 5, 10);
		scene.add(pointLight);

		// Rapier world — low gravity for floaty feel
		const gravity = new RAPIER.Vector3(0.0, -0.3, 0.0);
		const world = new RAPIER.World(gravity);

		// Spore colors matching the site palette
		const sporeColors = [
			new THREE.Color(0xa882c8), // purple
			new THREE.Color(0x82be9e), // green
			new THREE.Color(0xc8af82), // gold
			new THREE.Color(0x82a0c8), // blue
			new THREE.Color(0xc882a0), // pink
		];

		interface Spore {
			mesh: THREE.Mesh;
			body: InstanceType<typeof RAPIER.RigidBody>;
		}

		const spores: Spore[] = [];
		const NUM_SPORES = 60;

		// Create spore geometries
		const sphereGeo = new THREE.SphereGeometry(0.15, 12, 12);
		const capGeo = new THREE.SphereGeometry(0.3, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6);

		for (let i = 0; i < NUM_SPORES; i++) {
			const isMushroomCap = i < 15;
			const geo = isMushroomCap ? capGeo : sphereGeo;
			const colorIdx = i % sporeColors.length;
			const mat = new THREE.MeshPhysicalMaterial({
				color: sporeColors[colorIdx],
				transparent: true,
				opacity: 0.25 + Math.random() * 0.3,
				roughness: 0.6,
				metalness: 0.1,
				transmission: 0.3,
			});

			const scale = 0.5 + Math.random() * 1.5;
			const mesh = new THREE.Mesh(geo, mat);
			mesh.scale.setScalar(scale);
			scene.add(mesh);

			// Rapier rigid body
			const x = (Math.random() - 0.5) * 30;
			const y = (Math.random() - 0.5) * 20 + 5;
			const z = (Math.random() - 0.5) * 15 - 5;

			const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
				.setTranslation(x, y, z)
				.setLinearDamping(1.5)
				.setAngularDamping(1.0);
			const body = world.createRigidBody(bodyDesc);

			const colliderDesc = RAPIER.ColliderDesc.ball(0.15 * scale)
				.setRestitution(0.6)
				.setDensity(0.2);
			world.createCollider(colliderDesc, body);

			// Random gentle initial impulse
			body.applyImpulse(
				new RAPIER.Vector3(
					(Math.random() - 0.5) * 0.05,
					Math.random() * 0.03,
					(Math.random() - 0.5) * 0.05
				),
				true
			);

			spores.push({ mesh, body });
		}

		// Mouse interaction
		const mouse = new THREE.Vector2(0, 0);
		const handleMouseMove = (e: MouseEvent) => {
			mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
		};
		window.addEventListener('mousemove', handleMouseMove);

		// Resize handler
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', handleResize);

		const clock = new THREE.Clock();

		function animate() {
			animId = requestAnimationFrame(animate);
			const dt = clock.getDelta();
			const elapsed = clock.getElapsedTime();

			world.step();

			// Apply floating forces and keep spores in bounds
			for (let i = 0; i < spores.length; i++) {
				const { mesh, body } = spores[i];
				const pos = body.translation();

				// Gentle upward buoyancy to counter gravity + sinusoidal drift
				const phase = elapsed * 0.5 + i * 0.7;
				body.applyImpulse(
					new RAPIER.Vector3(
						Math.sin(phase) * 0.002,
						0.004 + Math.sin(phase * 0.3) * 0.002,
						Math.cos(phase * 0.7) * 0.002
					),
					true
				);

				// Mouse repulsion
				const dx = pos.x - mouse.x * 15;
				const dy = pos.y - mouse.y * 10;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < 5) {
					const force = 0.02 / (dist + 0.5);
					body.applyImpulse(
						new RAPIER.Vector3(dx * force, dy * force, 0),
						true
					);
				}

				// Wrap around bounds
				if (pos.y < -15) body.setTranslation(new RAPIER.Vector3(pos.x, 15, pos.z), true);
				if (pos.y > 20) body.setTranslation(new RAPIER.Vector3(pos.x, -10, pos.z), true);
				if (pos.x < -20) body.setTranslation(new RAPIER.Vector3(20, pos.y, pos.z), true);
				if (pos.x > 20) body.setTranslation(new RAPIER.Vector3(-20, pos.y, pos.z), true);

				// Sync Three.js mesh with Rapier body
				mesh.position.set(pos.x, pos.y, pos.z);
				const rot = body.rotation();
				mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);

				// Gentle breathing opacity
				const mat = mesh.material as THREE.MeshPhysicalMaterial;
				mat.opacity = 0.2 + Math.sin(elapsed * 0.8 + i) * 0.12;
			}

			// Slow camera drift
			camera.position.x = Math.sin(elapsed * 0.1) * 1.5;
			camera.position.y = Math.cos(elapsed * 0.08) * 1;
			camera.lookAt(0, 0, 0);

			renderer.render(scene, camera);
		}

		animate();

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
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
