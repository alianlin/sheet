import { ref, computed } from 'https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.esm-browser.prod.js';

export function usePagination(projects) {
  const currentPage = ref(1);
  const itemsPerPage = 6;
  const searchInput = ref('');
  const searchKeyword = ref('');
  const selectedYear = ref('');

  const filteredProjects = computed(() => {
    const keyword = searchKeyword.value.toLowerCase();
    return projects.value.filter((item) => {
      const matchKeyword =
        !searchKeyword.value ||
        item.title.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.client.toLowerCase().includes(keyword);
      const matchYear = !selectedYear.value || item.year === selectedYear.value;
      return matchKeyword && matchYear;
    });
  });

  const availableYears = computed(() => {
    const years = projects.value
      .map((p) => String(p.year).trim())
      .filter(Boolean);
    return [...new Set(years)].sort().reverse();
  });

  const pagedProjects = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredProjects.value.slice(start, start + itemsPerPage);
  });

  const totalPages = computed(() => {
    return Math.ceil(filteredProjects.value.length / itemsPerPage);
  });

  const doSearch = () => {
    searchKeyword.value = searchInput.value;
    currentPage.value = 1;
  };

  return {
    currentPage,
    itemsPerPage,
    searchInput,
    searchKeyword,
    selectedYear,
    filteredProjects,
    availableYears,
    pagedProjects,
    totalPages,
    doSearch,
  };
}