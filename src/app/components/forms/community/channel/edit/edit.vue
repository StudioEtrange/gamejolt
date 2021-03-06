<script lang="ts" src="./edit"></script>

<template>
	<app-form ref="form" name="communityChannelFormEdit">
		<app-form-group name="display_title" :label="$gettext(`Display Name`)" optional>
			<div class="help-block">
				<translate>
					This should be short and to the point. If you don't fill in a display name,
					we'll use your channel's URL path as its name.
				</translate>
			</div>

			<app-form-control
				:rules="{ min: 3, max: 30 }"
				:validate-on="['blur']"
				:placeholder="formModel.title"
			/>

			<app-form-control-errors />
		</app-form-group>

		<app-form-group name="title" :label="$gettext(`URL Path`)">
			<app-form-control
				type="text"
				:rules="{
					pattern: /^[a-z0-9_]+$/i,
					min: 3,
					max: 30,
					availability: {
						url: `/web/dash/communities/channels/check-field-availability/${community.id}/${model.id}`,
					},
				}"
				data-vv-delay="500"
			/>
			<app-form-control-errors>
				<app-form-control-error
					when="availability"
					:message="
						$gettext('A channel in this community with that URL path already exists.')
					"
				/>

				<app-form-control-error
					when="pattern"
					:message="
						$gettext(
							'Channel URL paths can only contain numbers, letters, and underscores (_).'
						)
					"
				/>
			</app-form-control-errors>
		</app-form-group>

		<!-- Show the current backgroud image if there is one -->
		<div v-if="formModel.background" class="form-group">
			<label class="control-label">
				<translate>Current Channel Image</translate>
			</label>

			<div class="-background-preview">
				<img
					:src="formModel.background.mediaserver_url"
					:alt="formModel.background.mediaserver_url"
				/>
			</div>

			<br />

			<div class="clearfix">
				<app-button @click="clearBackground">
					<translate>Clear Image</translate>
				</app-button>
			</div>
		</div>

		<app-form-group
			name="file"
			:label="
				!formModel.background
					? $gettext('Upload Channel Image')
					: $gettext('Change Channel Image')
			"
			:optional="true"
		>
			<p v-translate class="help-block">
				Your image must be a PNG or JPG.
				<br />
				<strong>PNGs are highly recommended as they produce a lossless image.</strong>
			</p>

			<p v-translate="{ dimensions: maxWidth + '×' + maxHeight }" class="help-block">
				Your channel image must be smaller than
				<code>%{dimensions}</code>.
				<br />
				<strong>Images are cropped to a ratio of 3.8 ÷ 1.</strong>
			</p>

			<app-form-control-upload
				:rules="{
					filesize: maxFilesize,
					max_img_dimensions: [maxWidth, maxHeight],
				}"
				accept=".png,.jpg,.jpeg,.webp"
			/>

			<app-form-control-errors />
		</app-form-group>

		<app-form-community-channel-permissions v-if="!model.is_archived" />

		<app-form-button show-when-valid>
			<translate>Save Channel</translate>
		</app-form-button>
	</app-form>
</template>

<style lang="stylus" scoped>
@import '~styles/variables'
@import '~styles-lib/mixins'
@import '../../../../community/channel/card/variables'

.-background-preview
	rounded-corners-lg()
	display: flex
	align-items: center
	width: $card-width
	height: $card-height
	overflow: hidden

	img
		width: 100%
</style>
