// Тест уровня: вытаскиваем чистую логику из index.html и проверяем её в Node.
// Запуск: node tools/test-level.mjs
import { readFileSync } from 'fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const m = html.match(/\/\/ LOGIC-BEGIN([\s\S]*?)\/\/ LOGIC-END/);
if (!m) throw new Error('Не нашёл блок LOGIC-BEGIN/LOGIC-END в index.html');

const get = new Function(m[1] + '\nreturn { generateLevel, solve, applyPour, isWin, isTubeComplete, topRun, SEED };');
const L = get();

const { tubes, solution } = L.generateLevel();
console.log('Сид:', L.SEED);
console.log('Уровень:', JSON.stringify(tubes));
const names = { '-1': 'ДИКИЙ' };
console.log('Пробирки (снизу вверх):');
tubes.forEach((t, i) => console.log(`  ${i}: [${t.map(b => names[String(b)] ?? 'Ц' + b).join(', ')}]`));

if (!solution || !solution.length) throw new Error('Решение не найдено!');
console.log('Решение (ходов):', solution.length);
console.log('  ' + solution.map(([s, d]) => `${s}->${d}`).join('  '));

// прогоняем решение и убеждаемся, что оно приводит к победе
let st = tubes.map(t => t.slice());
for (const [si, di] of solution) {
  st = L.applyPour(st, si, di, true);
  if (!st) throw new Error(`Ход ${si}->${di} невалидный!`);
}
if (!L.isWin(st)) throw new Error('Решение не приводит к победе!');
console.log('OK: уровень решается за', solution.length, 'ходов, финал корректный');
