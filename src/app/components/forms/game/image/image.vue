<template>
	<app-form name="mediaForm" ref="form">
		<app-form-group
			v-if="method === 'add'"
			name="file"
			:label="$gettext(`dash.games.media.image.form.image_label`)"
			:hide-label="true"
		>
			<p class="help-block" v-translate>
				<translate>Your image must be a PNG or JPG.</translate>
				<br />
				<strong>
					<translate>PNGs are highly recommended as they produce a lossless image.</translate>
				</strong>
			</p>

			<app-form-control-upload
				:rules="{
					filesize: maxFilesize,
					max_img_dimensions: [maxWidth, maxHeight],
				}"
				accept=".png,.jpg,.jpeg,.webp"
				:multiple="true"
				@changed="imagesSelected()"
			/>

			<app-form-control-errors :label="$gettext(`selection of images`)" />
		</app-form-group>

		<app-form-group
			v-if="method !== 'add'"
			name="caption"
			:label="$gettext(`dash.games.media.image.form.caption_label`)"
			:optional="true"
		>
			<app-form-control type="text" :rules="{ max: 200 }" />
			<app-form-control-errors />
			<p class="help-block">
				<translate>dash.games.media.image.form.caption_help</translate>
			</p>
		</app-form-group>

		<app-form-button v-if="method !== 'add'" show-when-valid>
			<translate v-if="method === 'add'">Add</translate>
			<translate v-else-if="method === 'edit'">Save</translate>
		</app-form-button>
	</app-form>
</template>

<script lang="ts" src="./image"></script>
