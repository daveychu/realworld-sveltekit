<script lang="ts">
	import { goto } from '$app/navigation';
	import { token } from '$lib/stores';

	async function logout() {
		token.set(null);
		goto('/');
	}
</script>

<div class="settings-page">
	<div class="container page">
		<div class="row">
			<div class="col-md-6 offset-md-3 col-xs-12">
				<h1 class="text-xs-center">Your Settings</h1>

				<form>
					<fieldset>
						<fieldset class="form-group">
							<input class="form-control" type="text" placeholder="URL of profile picture" />
						</fieldset>
						<fieldset class="form-group">
							<input class="form-control form-control-lg" type="text" placeholder="Your Name" />
						</fieldset>
						<fieldset class="form-group">
							<textarea
								class="form-control form-control-lg"
								rows="8"
								placeholder="Short bio about you"
							/>
						</fieldset>
						<fieldset class="form-group">
							<input class="form-control form-control-lg" type="text" placeholder="Email" />
						</fieldset>
						<fieldset class="form-group">
							<input class="form-control form-control-lg" type="password" placeholder="Password" />
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
