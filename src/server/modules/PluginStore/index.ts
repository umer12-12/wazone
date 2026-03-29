import urlJoin from 'url-join';

import { DEFAULT_LANG, isLocaleNotSupport } from '@/const/locale';
import { type LobeChatDatabase } from '@/database/type';
import { appEnv } from '@/envs/app';
import { type Locales } from '@/locales/resources';
import { normalizeLocale } from '@/locales/resources';
import { MarketToolModel } from '@/database/models/marketTool';

export class PluginStore {
  private readonly baseUrl: string;
  private readonly db?: LobeChatDatabase;

  constructor(baseUrl?: string, db?: LobeChatDatabase) {
    this.baseUrl = baseUrl || (appEnv as any).PLUGINS_INDEX_URL;
    this.db = db;
  }

  getPluginIndexUrl = (lang: Locales = DEFAULT_LANG) => {
    if (isLocaleNotSupport(lang)) return this.baseUrl;
    return urlJoin(this.baseUrl, `index.${normalizeLocale(lang)}.json`);
  };

  getPluginList = async (locale?: string): Promise<any[]> => {
    try {
      // 1. Fetch official tools
      let res = await fetch(this.getPluginIndexUrl(locale as Locales), {
        next: {
          revalidate: 3600,
        },
      });
      if (!res.ok) {
        res = await fetch(this.getPluginIndexUrl(DEFAULT_LANG), {
          next: {
            revalidate: 3600,
          },
        });
      }
      
      let officialPlugins: any[] = [];
      if (res.ok) {
        const json = await res.json();
        officialPlugins = json.plugins ?? [];
      }

      // 2. Fetch Sultan's tools if database is available
      if (this.db) {
        const marketModel = new MarketToolModel(this.db);
        const sultanTools = await marketModel.getActiveTools();
        
        // Merge Sultan's tools (prepend for better visibility)
        const mappedSultanTools = sultanTools.map(tool => ({
          identifier: tool.identifier,
          author: 'Sultan Umer',
          createdAt: tool.createdAt.toISOString(),
          homepage: tool.manifestUrl,
          manifest: tool.manifestUrl,
          meta: {
            avatar: '🪄',
            description: tool.prompt || 'Sultan Command Tool',
            title: tool.label,
          },
          schemaVersion: 1,
        }));
        
        return [...mappedSultanTools, ...officialPlugins];
      }

      return officialPlugins;
    } catch (e) {
      console.error('[getPluginListError] failed to fetch plugin list, error detail:');
      console.error(e);
      return [];
    }
  };
}
