import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { assertNever } from '../../../../../../../../utils/utils';
import { propRequired } from '../../../../../../../../utils/vue';
import AppCardListItem from '../../../../../../../../_common/card/list/item/item.vue';
import {
	Community,
	CommunityPresetChannelType,
} from '../../../../../../../../_common/community/community.model';
import FormCommunityChannelEditPreset from '../../../../../../../components/forms/community/channel/edit/preset.vue';

@Component({
	components: {
		AppCardListItem,
		FormCommunityChannelEditPreset,
	},
})
export default class AppCommunitiesEditChannelListPresetItem extends Vue {
	@Prop(propRequired(Community)) community!: Community;
	@Prop(propRequired(String)) presetType!: CommunityPresetChannelType;

	@Emit('edit') emitEdit() {}

	get elementId() {
		return `channel-container-${this.presetType}`;
	}

	get label() {
		switch (this.presetType) {
			case CommunityPresetChannelType.ALL:
				return this.$gettext(`All Posts`);
			case CommunityPresetChannelType.FEATURED:
				return this.$gettext(`Frontpage`);
		}

		assertNever(this.presetType);
	}
}
