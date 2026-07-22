import {
    CampaignSerializer
} from "./CampaignSerializer";
import type {
    Campaign
} from "./Campaign";

const campaign: Campaign = {
    version: 1,
    id: "test-campaign",
    name: "Test Campaign",

    scenes: [],
    assets: [],

    metadata: {
        createdAt:
            "2026-07-23T12:00:00.000Z",
        updatedAt:
            "2026-07-23T12:00:00.000Z"
    },

    extensions: {}
};

const json =
    CampaignSerializer.serialize(
        campaign
    );

const restoredCampaign =
    CampaignSerializer.deserialize(
        json
    );

console.assert(
    restoredCampaign.id ===
        campaign.id,
    "Campaign id was not preserved."
);

console.assert(
    restoredCampaign.name ===
        campaign.name,
    "Campaign name was not preserved."
);

console.assert(
    restoredCampaign.scenes.length === 0,
    "Campaign scenes were not preserved."
);

console.assert(
    restoredCampaign.assets.length === 0,
    "Campaign assets were not preserved."
);

console.assert(
    restoredCampaign.metadata.createdAt ===
        campaign.metadata.createdAt,
    "Campaign metadata was not preserved."
);

console.log(
    "CampaignSerializer round-trip test passed."
);