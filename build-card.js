import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * 读取文件内容
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`);
    throw error;
  }
}

/**
 * 规范化路径(自动处理Windows/Mac路径分隔符)
 */
function normalizePath(filePath) {
  return path.normalize(filePath);
}

/**
 * 创建条目的固定结构
 */
function createEntryTemplate() {
  return {
    keys: [],
    secondary_keys: [],
    constant: true,
    selective: true,
    use_regex: true,
    extensions: {
      exclude_recursion: false,
      probability: 100,
      useProbability: true,
      selectiveLogic: 0,
      group: "",
      group_override: false,
      group_weight: 100,
      prevent_recursion: false,
      delay_until_recursion: false,
      scan_depth: null,
      match_whole_words: null,
      use_group_scoring: false,
      case_sensitive: null,
      automation_id: "",
      vectorized: false,
      sticky: 0,
      cooldown: 0,
      delay: 0,
      match_persona_description: false,
      match_character_description: false,
      match_character_personality: false,
      match_character_depth_prompt: false,
      match_scenario: false,
      match_creator_notes: false,
      triggers: [],
      ignore_budget: false
    }
  };
}

/**
 * 转换 position 字符串为数值
 */
function convertPosition(positionStr) {
  const positionMap = {
    'before_char': 0,
    'after_char': 1,
    'before_em': 5,
    'after_em': 6,
    'before_an': 2,
    'after_an': 3,
    'at_depth': 4
  };
  return positionMap[positionStr] ?? 0;
}

/**
 * 构建角色书条目
 */
function buildCharacterBookEntry(config, index) {
  const entry = createEntryTemplate();

  entry.id = index;
  entry.comment = config.comment;
  entry.content = config.content ? readFile(normalizePath(config.content)) : "";
  entry.enabled = config.enabled ?? true;
  entry.position = config.position ?? "after_char";
  entry.insertion_order = config.insertion_order ?? 100;

  // 设置扩展字段
  entry.extensions.position = convertPosition(entry.position);
  entry.extensions.display_index = index;
  entry.extensions.depth = config.depth ?? 4;
  entry.extensions.role = config.role ?? 0;

  // [InitVar]初始化条目的特殊处理
  if (config.comment?.includes('[InitVar]')) {
    entry.constant = false;
  }

  return entry;
}

/**
 * 创建固定的 regex_scripts
 */
function createRegexScripts(statusBarPath) {
  const scripts = [
    {
      id: "9698c545-91a1-42c1-a4d5-486057de5d7a",
      scriptName: "对AI隐藏状态栏",
      disabled: false,
      runOnEdit: true,
      findRegex: "<StatusPlaceHolderImpl/>",
      replaceString: "",
      trimStrings: [],
      placement: [2],
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
      markdownOnly: false,
      promptOnly: true
    },
    {
      id: "fc3d2d10-c7bc-41b8-8eb5-6d36151134c2",
      scriptName: "去除更新变量",
      disabled: false,
      runOnEdit: true,
      findRegex: "/<UpdateVariable>[\\s\\S]*?</UpdateVariable>/gm",
      replaceString: "",
      trimStrings: [],
      placement: [2],
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
      markdownOnly: true,
      promptOnly: true
    }
  ];

  // 状态栏脚本(如果提供了状态栏文件)
  if (statusBarPath) {
    const statusBarContent = readFile(normalizePath(statusBarPath));
    scripts.push({
      id: "0a826eea-6150-4ef8-b31b-0f10f6f12053",
      scriptName: "状态栏",
      findRegex: "<StatusPlaceHolderImpl/>",
      replaceString: "```\n" + statusBarContent + "\n```",
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: true,
      promptOnly: false,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: 2
    });
  }

  return scripts;
}

/**
 * 创建固定的 TavernHelper_scripts
 */
function createTavernHelperScripts() {
  return [
    {
      type: "script",
      value: {
        id: "1f84fa2d-cd60-4015-be1b-cc801a8092be",
        name: "MVU Beta 脚本",
        content: "import 'https://testingcf.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate@beta/artifact/bundle.js'",
        info: "",
        buttons: [
          {
            name: "重新处理变量",
            visible: true
          },
          {
            name: "重新读取初始变量",
            visible: false
          },
          {
            name: "清除旧楼层变量",
            visible: false
          }
        ],
        data: {
          "是否显示变量更新错误": "是",
          "构建信息": new Date().toISOString() + " (generated)"
        },
        enabled: true
      }
    }
  ];
}

/**
 * 构建完整的角色卡
 */
function buildCharacterCard(configPath) {
  // 读取配置文件
  const configContent = readFile(configPath);
  const config = yaml.load(configContent);

  // 读取字段内容
  const fields = {};
  for (const [key, value] of Object.entries(config.fields)) {
    fields[key] = value ? readFile(normalizePath(value)) : "";
  }

  // 构建角色书条目
  const entries = [];
  if (config.character_book?.entries) {
    config.character_book.entries.forEach((entryConfig, index) => {
      entries.push(buildCharacterBookEntry(entryConfig, index));
    });
  }

  // 获取当前日期时间
  const now = new Date();
  const createDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} @${now.getHours()}h ${now.getMinutes()}m ${now.getSeconds()}s ${now.getMilliseconds()}ms`;

  // 构建完整的角色卡结构
  const card = {
    name: config.name,
    description: fields.description || "",
    personality: fields.personality || "",
    scenario: fields.scenario || "",
    first_mes: fields.first_mes || "",
    mes_example: fields.mes_example || "",
    creatorcomment: "",
    avatar: "none",
    talkativeness: config.extensions?.talkativeness || "0.5",
    fav: config.extensions?.fav || false,
    tags: [],
    spec: "chara_card_v3",
    spec_version: "3.0",
    data: {
      name: config.name,
      description: fields.description || "",
      personality: fields.personality || "",
      scenario: fields.scenario || "",
      first_mes: fields.first_mes || "",
      mes_example: fields.mes_example || "",
      creator_notes: fields.creator_notes || "",
      system_prompt: fields.system_prompt || "",
      post_history_instructions: fields.post_history_instructions || "",
      tags: [],
      creator: config.creator || "",
      character_version: config.character_version || "",
      alternate_greetings: [],
      extensions: {
        talkativeness: config.extensions?.talkativeness || "0.5",
        fav: config.extensions?.fav || false,
        world: config.extensions?.world || config.name,
        depth_prompt: {
          prompt: "",
          depth: 4,
          role: "system"
        },
        regex_scripts: createRegexScripts(config.extensions?.status_bar),
        TavernHelper_scripts: createTavernHelperScripts()
      },
      group_only_greetings: [],
      character_book: {
        entries: entries,
        name: config.character_book?.name || config.name
      }
    },
    create_date: createDate
  };

  return card;
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('用法: node build-card.js <配置文件路径>');
    console.error('示例: node build-card.js config.yaml');
    process.exit(1);
  }

  const configPath = args[0];

  try {
    console.log(`正在读取配置文件: ${configPath}`);
    const card = buildCharacterCard(configPath);

    const outputPath = `${card.name}.json`;
    fs.writeFileSync(outputPath, JSON.stringify(card, null, 4), 'utf-8');

    console.log(`✓ 角色卡已成功生成: ${outputPath}`);
  } catch (error) {
    console.error('构建失败:', error.message);
    process.exit(1);
  }
}

main();
