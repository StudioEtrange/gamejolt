<template>
	<app-form name="descriptionForm" ref="form">
		<app-form-group name="description_content" :label="$gettext('Description')">
			<template slot="label">
				<app-jolticon icon="edit" />
				<strong>
					<translate>Game Description</translate>
				</strong>
			</template>

			<app-form-control-content
				:placeholder="$gettext(`Write your game description here...`)"
				content-context="game-description"
				:model-id="model.id"
				:rules="{
					content_required: true,
					content_no_media_uploads: true,
					max_content_length: [lengthLimit],
				}"
				:max-height="0"
				:validate-on="['blur']"
			/>

			<app-form-control-errors />
		</app-form-group>

		<app-form-game-description-tags
			class="-tags"
			:text="tagText"
			:tags="tags"
			:content="contentDocument"
			@tag="addTag($event)"
		/>

		<app-expand :when="isFnafDetected">
			<div class="alert alert-notice">
				<div v-translate>
					<strong>
						It appears that your game may be a Five Nights at Freddy's fan game,
						spinoff, or unofficial sequel.
					</strong>
					Therefore, we have added the hashtag
					<code>#fnaf</code>
					to your game's description. We require this tag for all games derived from the
					Five Nights at Freddy's series.
				</div>

				<app-game-perms required="details" tag="div" class="alert-actions">
					<app-form-button
						:solid="false"
						trans
						icon="tag"
						@before-submit="addAutotag('fnaf')"
					>
						<translate>dash.games.add.fnaf_autotag_accept</translate>
					</app-form-button>

					<app-form-button
						:solid="false"
						:primary="false"
						trans
						@before-submit="skipAutotag()"
					>
						<translate>dash.games.add.fnaf_autotag_reject</translate>
					</app-form-button>
				</app-game-perms>
			</div>
		</app-expand>

		<app-game-perms required="details">
			<app-dash-game-wizard-controls v-if="!isFnafDetected">
				<app-form-button>
					<translate>Save Description</translate>
				</app-form-button>
			</app-dash-game-wizard-controls>
		</app-game-perms>
	</app-form>
</template>

<style lang="stylus" scoped>
@import '~styles/variables'
@import '../../../../../_styles/common/forms'

.-label
	margin-bottom: $form-common-spacing

.-tags
	margin-bottom: $line-height-computed
</style>

<script lang="ts" src="./description"></script>
