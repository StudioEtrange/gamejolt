<template>
	<app-form name="songForm">
		<app-form-group name="title" :label="$gettext(`dash.games.music.form.title_label`)">
			<app-form-control type="text" :rules="{ max: 150 }" />
			<app-form-control-errors />
		</app-form-group>

		<app-form-group name="file" :label="fileLabel" :optional="method === 'edit'">
			<p class="help-block">
				<translate
					:translate-params="{
						maxFilesize: number(maxFilesize / 1024 / 1024),
					}"
				>
					Song uploads are currently capped at %{ maxFilesize }MB per file. Only MP3s are supported
					at this time.
				</translate>
			</p>

			<app-form-control-upload
				:rules="{
					filesize: maxFilesize,
				}"
				accept=".mp3"
			/>

			<app-form-control-errors :label="$gettext(`dash.games.music.form.file_error_label`)" />
		</app-form-group>

		<app-form-button>
			<translate>dash.games.music.form.submit_button</translate>
		</app-form-button>
	</app-form>
</template>

<script lang="ts" src="./song"></script>
