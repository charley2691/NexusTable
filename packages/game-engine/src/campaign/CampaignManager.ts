import {
  Campaign,
  CampaignSerializer,
} from "@nexustable/shared";

export class CampaignManager {
  private activeCampaign: Campaign | null = null;

  createCampaign(name: string): Campaign {
    const now = new Date().toISOString();

    const campaign: Campaign = {
      version: 1,

      id: crypto.randomUUID(),
      name,

      scenes: [],
      assets: [],
      activeSceneId: undefined,

      metadata: {
        createdAt: now,
        updatedAt: now,
      },

      extensions: {},
    };

    this.activeCampaign = campaign;

    return campaign;
  }

  loadCampaign(campaign: Campaign): void {
    this.activeCampaign = campaign;
  }

  loadCampaignFromJson(
    json: string
  ): Campaign {
    const campaign =
      CampaignSerializer.deserialize(
        json
      );

    this.activeCampaign =
      campaign;

    return campaign;
  }

  saveActiveCampaign(): string {
    if (!this.activeCampaign) {
      throw new Error(
        "No active campaign to save."
      );
    }

    return CampaignSerializer.serialize(
      this.activeCampaign
    );
  }

  cloneActiveCampaign(): Campaign {
    if (!this.activeCampaign) {
      throw new Error(
        "No active campaign to clone."
      );
    }

    return CampaignSerializer.clone(
      this.activeCampaign
    );
  }

  closeCampaign(): void {
    this.activeCampaign = null;
  }

  getActiveCampaign(): Campaign | null {
    return this.activeCampaign;
  }

  hasActiveCampaign(): boolean {
    return this.activeCampaign !== null;
  }

  renameActiveCampaign(name: string): boolean {
    if (!this.activeCampaign) {
      return false;
    }

    this.activeCampaign.name = name;
    this.touchActiveCampaign();

    return true;
  }

  touchActiveCampaign(): void {
    if (!this.activeCampaign) {
      return;
    }

    this.activeCampaign.metadata.updatedAt =
      new Date().toISOString();
  }
}