import fs from 'fs';
const data = JSON.parse(fs.readFileSync('与傲娇废宅妹妹的同居生活.json', 'utf-8'));

console.log('角色书条目数量:', data.data.character_book.entries.length);
console.log('\n条目列表:');
data.data.character_book.entries.forEach((e, i) => {
  console.log(`${i}. ${e.comment}`);
  console.log(`   enabled: ${e.enabled}, position: ${e.position}(值${e.extensions.position}), order: ${e.insertion_order}, depth: ${e.extensions.depth}, role: ${e.extensions.role}`);
  console.log(`   content长度: ${e.content.length}字符`);
});

console.log('\nregex_scripts数量:', data.data.extensions.regex_scripts.length);
data.data.extensions.regex_scripts.forEach((s, i) => {
  console.log(`${i}. ${s.scriptName} - disabled: ${s.disabled}`);
});
