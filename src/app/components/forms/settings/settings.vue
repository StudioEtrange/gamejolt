<script lang="ts" src="./settings"></script>

<template>
	<app-form ref="form" name="settingsForm" @changed="onChange">
		<fieldset v-if="GJ_IS_CLIENT" id="settings-client">
			<legend>
				<translate>settings.client</translate>
			</legend>

			<app-form-group
				name="game_install_dir"
				:label="$gettext('settings.game_install_dir_label')"
			>
				<div class="pull-right">
					<app-button sm @click="changeLocation('game-install-dir')">
						<translate>settings.change_location_button</translate>
					</app-button>
				</div>

				<div class="form-static">
					<code>{{ formModel.game_install_dir }}</code>
				</div>

				<p class="help-block">
					<translate>settings.game_install_dir_help</translate>
				</p>

				<input
					ref="game-install-dir"
					class="hidden"
					type="file"
					nwdirectory
					@change="onSelectedInstallDir($event.target.value)"
				/>

				<app-form-control-errors />
			</app-form-group>

			<app-form-group
				:class="{ 'sans-margin-bottom': formModel.limit_downloads }"
				name="limit_downloads"
				:label="$gettext('settings.limit_downloads_label')"
			>
				<app-form-control-toggle class="pull-right" />
			</app-form-group>
			<br v-if="formModel.limit_downloads" />

			<app-form-group
				v-if="formModel.max_download_count !== -1"
				name="max_download_count"
				:label="$gettext('settings.max_download_count_label')"
				:hide-label="true"
			>
				<app-form-control type="number" :rules="{ min_value: 1 }" />
				<p class="help-block">
					<translate>settings.max_download_count_help</translate>
				</p>
				<app-form-control-errors />
			</app-form-group>

			<app-form-group
				:class="{ 'sans-margin-bottom': formModel.limit_downloads }"
				name="limit_extractions"
				:label="$gettext('settings.limit_extractions_label')"
			>
				<app-form-control-toggle class="pull-right" />
				<p class="help-block">
					<translate>settings.limit_extractions_help</translate>
				</p>
			</app-form-group>
			<br v-if="formModel.limit_downloads" />

			<app-form-group
				v-if="formModel.max_extract_count !== -1"
				name="max_extract_count"
				:label="$gettext('settings.max_extract_count_label')"
				:hide-label="true"
			>
				<app-form-control type="number" :rules="{ min_value: 1 }" />
				<p class="help-block">
					<translate>settings.max_extract_count_help</translate>
				</p>
				<app-form-control-errors />
			</app-form-group>

			<app-form-group
				name="queue_when_playing"
				:label="$gettext('settings.queue_when_playing_label')"
			>
				<app-form-control-toggle class="pull-right" />
				<p class="help-block">
					<translate>settings.queue_when_playing_help</translate>
				</p>
			</app-form-group>

			<app-form-group
				v-if="canClientAutostart"
				name="autostart_client"
				:label="$gettext('settings.autostart_client_label')"
			>
				<app-form-control-toggle class="pull-right" />
			</app-form-group>
		</fieldset>

		<fieldset id="settings-site">
			<legend>
				<translate>Site</translate>
			</legend>

			<app-form-group name="animated_thumbnails" :label="$gettext('Animated thumbnails?')">
				<app-form-control-toggle class="pull-right" />
				<p class="help-block">
					<translate>
						Turning this off will show a static image instead of animated thumbnails.
					</translate>
				</p>
			</app-form-group>

			<app-form-group name="theme_dark" :label="$gettext('Dark mode?')">
				<app-form-control-toggle class="pull-right" />
				<p class="help-block">
					<translate>Give your eyes a rest, come to the dark side!</translate>
				</p>
			</app-form-group>

			<app-form-group name="theme_always_ours" :label="$gettext('Always use your theme?')">
				<app-form-control-toggle class="pull-right" />
				<p class="help-block">
					<translate>
						Don't switch to other themes when viewing profiles, games or communities.
					</translate>
				</p>
			</app-form-group>
		</fieldset>

		<fieldset id="settings-restrictions">
			<legend>
				<translate>Restrictions</translate>
			</legend>

			<app-form-group name="restricted_browsing" :label="$gettext('Restrict browsing?')">
				<app-form-control-toggle class="pull-right" />
				<p class="help-block">
					<translate>
						This will block games that have a maturity rating of "Mature" and ask if
						you'd like to continue before showing the full page.
					</translate>
				</p>
			</app-form-group>
		</fieldset>

		<fieldset id="settings-notifications">
			<legend>
				<translate>Notifications</translate>
			</legend>

			<app-form-group name="feed_notifications" :label="$gettext('Feed notifications?')">
				<app-form-control-toggle
					class="pull-right"
					:disabled="browserNotificationsDisabled"
				/>
				<p class="help-block">
					<translate>
						We attempt to send you notifications as they happen. You can disable them
						here anytime.
					</translate>
				</p>
				<div v-if="browserNotificationsDisabled" class="alert">
					You've disabled this in your browser. If you'd like to get notifications, you'll
					have to give us permission within your browser first.
				</div>
			</app-form-group>

			<app-form-group name="broadcast_modal" :label="$gettext('Show broadcasts?')">
				<app-form-control-toggle class="pull-right" />
				<p class="help-block">
					<translate>
						With this on you will receive notifications of new site features that have
						been added since you last visited.
					</translate>
				</p>
			</app-form-group>
		</fieldset>
	</app-form>
</template>
