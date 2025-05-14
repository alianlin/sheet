// ✅ useFetchData.js with cache and loading indicator support
import { ref, onMounted, watch } from 'https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.esm-browser.prod.js';

export function useFetchData() {
  const categories = ref([]);
  const currentCategory = ref('');
  const projects = ref([]);
  const path = ref('');
  const isTabLoading = ref(false); // ✅ 用來顯示 tab 切換時的 loading 狀態

  const apiKey = 'AIzaSyB4qtRfCPfBRvf8l5mzJX1LZgmfzePn_-U';
  const sheetId = '1l38WlHpWKWjQ0mBtoCwhIUqVxqX6siaF_SlIZdo4V6k';
  const cache = new Map(); // ✅ 快取所有 tab 資料

  const fetchSheetNames = async () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const sheetNames = data.sheets.map((s) => s.properties.title);
      categories.value = sheetNames;

      const hash = decodeURIComponent(window.location.hash.replace('#', ''));
      if (hash && sheetNames.includes(hash)) {
        currentCategory.value = hash;
      } else {
        currentCategory.value = sheetNames[0] || '';
      }
    } catch (err) {
      console.error('🚨 無法取得工作表清單:', err);
    }
  };

  const fetchSheetData = async (sheetName) => {
    if (cache.has(sheetName)) {
      console.log(`📦 從 cache 載入 ${sheetName}`);
      projects.value = cache.get(sheetName);
      const found = projects.value.find((p) => p.path);
      path.value = found?.path || '';
      return;
    }

    const range = `'${sheetName}'!A1:Z`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const values = data.values;
      if (!values || values.length === 0) {
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
        obj.responsibilities = obj.responsibilities
          ? obj.responsibilities.split('、').filter((r) => r.trim() !== '')
          : [];
        return obj;
      });

      cache.set(sheetName, parsed); // ✅ 存入快取
      projects.value = parsed;
      const found = parsed.find((p) => p.path);
      path.value = found?.path || '';
    } catch (err) {
      console.error('🚨 資料載入失敗:', err);
    }
  };

  onMounted(async () => {
    await fetchSheetNames();
    await fetchSheetData(currentCategory.value);
  });

  watch(currentCategory, async (newSheet) => {
    isTabLoading.value = true;
    await fetchSheetData(newSheet);
    isTabLoading.value = false;
  });

  return {
    categories,
    currentCategory,
    projects,
    path,
    fetchData: fetchSheetNames,
    isTabLoading // ✅ 回傳給外部使用
  };
}