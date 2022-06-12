<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores';
	import { put } from '$lib/utils';

	let { image, username, email, bio, password } = $user;

	async function updateSettings() {
		const response = await put(`api/user`, { user: { username, email, password, bio, image } });

		if (response.user) {
			user.set(response.user);
			goto('/');
		}
		goto('/');
	}

	async function logout() {
		user.set(null);
		goto('/');
	}
</script>

<div class="settings-page">
	<div class="container page">
		<div class="row">
			<div class="col-md-6 offset-md-3 col-xs-12">
				<h1 class="text-xs-center">Your Settings</h1>

				<form on:submit|preventDefault={updateSettings}>
					<fieldset>
						<fieldset class="form-group">
							<input
								class="form-control"
								type="text"
								placeholder="URL of profile picture"
								bind:value={image}
							/>
						</fieldset>
						<fieldset class="form-group">
							<input
								class="form-control form-control-lg"
								type="text"
								placeholder="Your Name"
								bind:value={username}
							/>
						</fieldset>
						<fieldset class="form-group">
							<textarea
								class="form-control form-control-lg"
								rows="8"
								placeholder="Short bio about you"
								bind:value={bio}
							/>
						</fieldset>
						<fieldset class="form-group">
							<input
								class="form-control form-control-lg"
								type="text"
								placeholder="Email"
								bind:value={email}
							/>
						</fieldset>
						<fieldset class="form-group">
							<input
								class="form-control form-control-lg"
								type="password"
								placeholder="Password"
								bind:value={password}
							/>
						</fieldset>
						<button class="btn btn-lg btn-primary pull-xs-right"> Update Settings </button>
					</fieldset>
				</form>
				<!-- Line break for logout button -->
				<hr />
				<button class="btn btn-outline-danger" on:click={logout}> Or click here to logout. </button>
			</div>
		</div>
	</div>
</div>
