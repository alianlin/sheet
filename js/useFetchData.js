// ✅ useFetchData.js with cache and image URL fix
import { ref, onMounted, watch } from 'https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.esm-browser.prod.js';

export function useFetchData() {
  const categories = ref([]);
  const currentCategory = ref('');
  const projects = ref([]);
  const path = ref('');
  const isTabLoading = ref(false);

  const apiKey = 'AIzaSyB4qtRfCPfBRvf8l5mzJX1LZgmfzePn_-U';
  const sheetId = '1l38WlHpWKWjQ0mBtoCwhIUqVxqX6siaF_SlIZdo4V6k';
  const cache = new Map();

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

  const convertGoogleDriveUrl = (url) => {
    const match = url.match(/https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view.*/);
    return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
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

        // ✅ 修正 Google Drive 圖片連結
        if (obj.imageUrl?.includes('drive.google.com')) {
          obj.imageUrl = convertGoogleDriveUrl(obj.imageUrl);
        }

        return obj;
      });

      cache.set(sheetName, parsed);
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
    isTabLoading
  };
}
