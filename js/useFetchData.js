import {
  ref,
  onMounted,
  watch,
} from 'https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.esm-browser.prod.js';

export function useFetchData() {
  const categories = ref([]); // 所有工作表名稱
  const currentCategory = ref(''); // 當前選中的 sheet 名稱
  const projects = ref([]); // 當前工作表的資料
  const path = ref(''); // 可選欄位，例如作品資料的共用屬性

  const apiKey = 'AIzaSyB4qtRfCPfBRvf8l5mzJX1LZgmfzePn_-U';
  const sheetId = '1l38WlHpWKWjQ0mBtoCwhIUqVxqX6siaF_SlIZdo4V6k';

  const fetchSheetNames = async () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const sheetNames = data.sheets.map((s) => s.properties.title);

      categories.value = sheetNames;
      currentCategory.value = sheetNames[0] || '';
    } catch (err) {
      console.error('🚨 無法取得工作表清單:', err);
    }
  };

  const fetchSheetData = async (sheetName) => {
    const range = `'${sheetName}'!A1:Z`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const values = data.values;

      if (!values || values.length === 0) {
        console.warn('⚠️ 工作表無資料');
        projects.value = [];
        return;
      }

      const headers = values[0];
      const rows = values.slice(1);

      const parsed = rows.map((row) => {
        const obj = {};
        headers.forEach((key, i) => {
          obj[key] = row[i]?.trim() || '';
        });

        obj.id = obj.id || '';
        obj.category = obj.category || '';
        obj.path = obj.path || '';
        obj.title = obj.title || '';
        obj.client = obj.client || '';
        obj.year = obj.year || '';
        obj.description = obj.description || '';
        obj.link = obj.link || '';
        obj.image = obj.image || null;

        obj.responsibilities = obj.responsibilities
          ? obj.responsibilities.split('、').filter((r) => r.trim() !== '')
          : [];

        return obj;
      });

      projects.value = parsed;
      const found = parsed.find((p) => p.path);
      path.value = found?.path || '';
    } catch (err) {
      console.error('🚨 資料載入失敗:', err);
    }
  };

  // ✅ 封裝初次載入
  const fetchData = async () => {
    await fetchSheetNames();
    if (currentCategory.value) {
      await fetchSheetData(currentCategory.value);
    }
  };

  onMounted(fetchData);

  watch(currentCategory, async (newSheet) => {
    console.log('🔁 currentCategory 切換為：', newSheet);
    await fetchSheetData(newSheet);
  });

  return {
    categories,
    currentCategory,
    projects,
    path,
    fetchData, // ✅ 傳出去給外面用！
  };
}