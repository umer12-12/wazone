import { type LobeChatDatabase } from '@lobechat/database';
import { SystemConfigModel } from '@lobechat/database/models/systemConfig';

export class SystemConfigService {
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase) {
    this.db = db;
  }

  async getSettings(): Promise<Record<string, string>> {
    const model = new SystemConfigModel(this.db);
    const configs = await model.all();
    
    const settings: Record<string, string> = {};
    configs.forEach((config) => {
      settings[config.key] = config.value;
    });
    
    return settings;
  }

  async updateSetting(key: string, value: string, group?: string, description?: string) {
    const model = new SystemConfigModel(this.db);
    return await model.set(key, value, group, description);
  }
}
