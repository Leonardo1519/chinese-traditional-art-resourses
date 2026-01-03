import { resourceSections } from './resources.js';
import { museumCategories, museumResources } from './museum-resources.js';
import { celebrityResources, internationalResources, redResources } from './section-resources.js';
import { filmCategories, filmResources } from './film-resources.js';
import { bookCategories, bookResources } from './books-resources.js';
import { designProjects } from './design-resources.js';
import { studioResources } from './studio-resources.js';

// ========================================
// 全站搜索功能
// ========================================

// 搜索数据源 - 汇总所有资源
const buildSearchIndex = () => {
  const searchIndex = [];

  // 添加资源板块数据（国家级、地方、学术）
  resourceSections.forEach((section) => {
    const categoryMap = {
      national: '国家级平台',
      local: '地方资源库',
      academic: '学术研究',
    };
    section.resources.forEach((resource) => {
      searchIndex.push({
        ...resource,
        category: categoryMap[section.id] || section.id,
        categoryId: section.id,
      });
    });
  });

  // 添加博物馆数据
  Object.entries(museumResources).forEach(([regionId, museums]) => {
    const region = museumCategories.find((c) => c.id === regionId);
    museums.forEach((museum) => {
      searchIndex.push({
        ...museum,
        category: '文史博物馆',
        categoryId: 'museum',
        subtitle: region?.displayName || regionId,
      });
    });
  });

  // 添加名人纪念馆数据
  celebrityResources.forEach((resource) => {
    searchIndex.push({
      ...resource,
      category: '名人纪念馆',
      categoryId: 'celebrity',
    });
  });

  // 添加国际非遗数据
  internationalResources.forEach((resource) => {
    searchIndex.push({
      ...resource,
      category: '国际非遗',
      categoryId: 'international',
    });
  });

  // 添加红色专区数据
  redResources.forEach((resource) => {
    searchIndex.push({
      ...resource,
      category: '红色专区',
      categoryId: 'red',
    });
  });

  // 添加影视数据
  Object.entries(filmResources).forEach(([categoryId, films]) => {
    const category = filmCategories.find((c) => c.id === categoryId);
    films.forEach((film) => {
      searchIndex.push({
        ...film,
        category: '非遗影视',
        categoryId: 'film',
        subtitle: category?.displayName || categoryId,
      });
    });
  });

  // 添加书籍数据
  Object.entries(bookResources).forEach(([categoryId, books]) => {
    const category = bookCategories.find((c) => c.id === categoryId);
    books.forEach((book) => {
      searchIndex.push({
        name: book.name,
        description: book.description,
        url: book.url,
        logo: book.cover,
        tags: book.tags,
        category: '设计书籍',
        categoryId: 'books',
        subtitle: category?.displayName || categoryId,
      });
    });
  });

  // 添加文创项目数据
  designProjects.forEach((project) => {
    searchIndex.push({
      name: project.name,
      description: project.description,
      url: project.url,
      logo: project.cover,
      tags: project.tags,
      category: '文创项目',
      categoryId: 'design',
    });
  });

  // 添加设计工作室数据
  studioResources.forEach((studio) => {
    searchIndex.push({
      ...studio,
      category: '设计工作室',
      categoryId: 'studio',
    });
  });

  return searchIndex;
};

// 高亮匹配文本
const highlightText = (text, keyword) => {
  if (!keyword || !text) return text;
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedKeyword})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// 执行搜索
const performSearch = (keyword, searchIndex) => {
  if (!keyword || keyword.trim().length === 0) {
    return [];
  }

  const query = keyword.toLowerCase().trim();
  const results = [];

  searchIndex.forEach((item) => {
    let score = 0;
    const matchedFields = [];

    // 名称匹配（权重最高）
    if (item.name && item.name.toLowerCase().includes(query)) {
      score += 100;
      if (item.name.toLowerCase().startsWith(query)) {
        score += 50; // 开头匹配额外加分
      }
      matchedFields.push('name');
    }

    // 标签匹配（权重次高）
    if (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(query))) {
      score += 60;
      matchedFields.push('tags');
    }

    // 描述匹配
    if (item.description && item.description.toLowerCase().includes(query)) {
      score += 30;
      matchedFields.push('description');
    }

    // 副标题匹配
    if (item.subtitle && item.subtitle.toLowerCase().includes(query)) {
      score += 40;
      matchedFields.push('subtitle');
    }

    // 分类匹配
    if (item.category && item.category.toLowerCase().includes(query)) {
      score += 20;
      matchedFields.push('category');
    }

    if (score > 0) {
      results.push({
        ...item,
        score,
        matchedFields,
      });
    }
  });

  // 按分数排序
  results.sort((a, b) => b.score - a.score);

  return results;
};

// 渲染单个搜索结果项
const renderSearchResultItem = (item, keyword) => {
  const logoSrc = item.logo || 'assets/brand/site-logo.svg';
  const highlightedName = highlightText(item.name, keyword);
  const highlightedDesc = highlightText(
    item.description?.slice(0, 80) + (item.description?.length > 80 ? '...' : ''),
    keyword
  );
  const tags = (item.tags || []).slice(0, 3);

  return `
    <a class="search-result-item" href="${item.url}" target="_blank" rel="noreferrer">
      <img class="search-result-logo" src="${logoSrc}" alt="${item.name}" width="48" height="48" onerror="this.src='assets/brand/site-logo.svg'" loading="lazy" decoding="async" />
      <div class="search-result-info">
        <h4 class="search-result-name">${highlightedName}</h4>
        <p class="search-result-desc">${highlightedDesc}</p>
        ${
          tags.length > 0
            ? `<div class="search-result-tags">${tags.map((tag) => `<span class="search-result-tag">${tag}</span>`).join('')}</div>`
            : ''
        }
      </div>
      <svg class="search-result-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5l7 7-7 7"></path>
      </svg>
    </a>
  `;
};

// 渲染搜索结果
const renderSearchResults = (results, keyword, container) => {
  if (results.length === 0) {
    container.innerHTML = `
      <div class="search-no-results">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
          <path d="M8 8l6 6"></path>
          <path d="M14 8l-6 6"></path>
        </svg>
        <p>未找到相关资源</p>
        <span>尝试使用其他关键词搜索</span>
      </div>
    `;
    return;
  }

  // 按分类分组
  const groupedResults = {};
  results.forEach((result) => {
    const category = result.category || '其他';
    if (!groupedResults[category]) {
      groupedResults[category] = [];
    }
    groupedResults[category].push(result);
  });

  // 渲染分组结果
  let html = '';
  let groupIndex = 0;
  Object.entries(groupedResults).forEach(([category, items]) => {
    const groupId = `search-group-${groupIndex}`;
    html += `
      <div class="search-result-group" id="${groupId}">
        <div class="search-group-title">
          ${category}
          <span class="search-group-count">${items.length}</span>
        </div>
        <div class="search-group-items">
    `;

    // 先显示前5个
    items.slice(0, 5).forEach((item) => {
      html += renderSearchResultItem(item, keyword);
    });

    html += '</div>'; // 关闭 search-group-items

    // 如果有更多结果，显示加载更多按钮
    if (items.length > 5) {
      const remainingCount = items.length - 5;
      html += `
        <div class="search-result-more">
          <button class="search-load-more-btn" data-group="${groupId}" data-category="${category}" data-loaded="5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
            加载更多 (${remainingCount})
          </button>
        </div>
      `;
    }

    html += '</div>'; // 关闭 search-result-group
    groupIndex++;
  });

  container.innerHTML = html;

  // 绑定加载更多按钮事件
  container.querySelectorAll('.search-load-more-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const groupId = btn.dataset.group;
      const category = btn.dataset.category;
      const loaded = parseInt(btn.dataset.loaded, 10);
      const items = groupedResults[category];
      const groupItemsContainer = document.querySelector(`#${groupId} .search-group-items`);

      if (!groupItemsContainer || !items) return;

      // 加载剩余所有项
      const remainingItems = items.slice(loaded);
      remainingItems.forEach((item) => {
        groupItemsContainer.insertAdjacentHTML('beforeend', renderSearchResultItem(item, keyword));
      });

      // 移除加载更多按钮
      btn.closest('.search-result-more').remove();
    });
  });
};

// 初始化搜索功能
const initSearch = () => {
  const searchTrigger = document.getElementById('searchTrigger');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');
  const searchResults = document.getElementById('searchResults');

  if (!searchTrigger || !searchOverlay) return;

  // 构建搜索索引
  const searchIndex = buildSearchIndex();

  // 打开搜索弹窗
  const openSearch = () => {
    searchOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      searchInput?.focus();
    }, 100);
  };

  // 关闭搜索弹窗
  const closeSearch = () => {
    searchOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
    if (searchInput) {
      searchInput.value = '';
    }
    if (searchResults) {
      searchResults.innerHTML = `
        <div class="search-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <p>输入关键词搜索全站资源</p>
          <span>支持搜索：资源名称、描述、标签</span>
        </div>
      `;
    }
  };

  // 绑定事件
  searchTrigger.addEventListener('click', openSearch);

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  // 点击遮罩层关闭
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      closeSearch();
    }
  });

  // ESC 键关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('is-active')) {
      closeSearch();
    }
    // Ctrl/Cmd + K 打开搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchOverlay.classList.contains('is-active')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
  });

  // 搜索输入防抖
  let searchTimeout = null;
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value;

      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      if (!keyword.trim()) {
        searchResults.innerHTML = `
          <div class="search-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
            <p>输入关键词搜索全站资源</p>
            <span>支持搜索：资源名称、描述、标签</span>
          </div>
        `;
        return;
      }

      searchTimeout = setTimeout(() => {
        const results = performSearch(keyword, searchIndex);
        renderSearchResults(results, keyword, searchResults);
      }, 150);
    });
  }
};

const renderResourceCard = (resource) => {
  const tags = (resource.tags || [])
    .map((tag) => `<span class="chip">${tag}</span>`)
    .join('');

  const tagsMarkup = tags ? `<div class="tags-row">${tags}</div>` : '';
  const logoClass = resource.logoClass ? ` ${resource.logoClass}` : '';

  return `
    <article class="resource-card">
      <div class="card-media">
        <img class="resource-logo${logoClass}" src="${resource.logo}" alt="${resource.name} logo" width="88" height="88" loading="lazy" decoding="async" />
      </div>
      <div class="resource-meta">
        <h3>${resource.name}</h3>
        ${resource.subtitle ? `<small>${resource.subtitle}</small>` : ''}
      </div>
      <p class="resource-description" data-full-text="${resource.description}">${resource.description}</p>
      ${tagsMarkup}
      <div class="card-actions">
        <a class="card-link" href="${resource.url}" target="_blank" rel="noreferrer">访问平台 →</a>
      </div>
    </article>
  `;
};

// 新板块的资源映射
const newSectionResources = {
  celebrity: celebrityResources,
  international: internationalResources,
  red: redResources,
};

const initSections = () => {
  // 初始化原有板块
  resourceSections.forEach((section) => {
    const grid = document.querySelector(`[data-grid=\"${section.id}\"]`);
    if (!grid) return;
    grid.innerHTML = section.resources.map(renderResourceCard).join('');
    const countTarget = document.querySelector(
      `[data-count-for="${section.id}"]`
    );
    if (countTarget) {
      countTarget.textContent = section.resources.length.toString();
    }
  });

  // 初始化新板块（名人纪念馆、国际非遗、红色专区）
  Object.entries(newSectionResources).forEach(([sectionId, resources]) => {
    const grid = document.querySelector(`[data-grid="${sectionId}"]`);
    if (!grid) return;
    grid.innerHTML = resources.map(renderResourceCard).join('');
    
    // 更新计数器
    const countTargets = document.querySelectorAll(
      `[data-count-for="${sectionId}"], [data-count-for="${sectionId}-grid"]`
    );
    countTargets.forEach((target) => {
      target.textContent = resources.length.toString();
    });

    // 红色专区省市覆盖统计：当前按固定18个省市区域展示
    if (sectionId === 'red') {
      const regionTarget = document.querySelector('[data-count-for="red-region"]');
      if (regionTarget) {
        regionTarget.textContent = '18';
      }
    }
  });
};

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^=\"#\"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href')?.substring(1);
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
};

const initScrollTopButtons = () => {
  const buttons = document.querySelectorAll('.scroll-top-btn');
  if (!buttons.length) return;
  const root = document.documentElement;
  const PT_TO_PX = 96 / 72;
  const GAP_PT = 12;

  const toggleVisibility = () => {
    const currentScroll =
      window.scrollY ??
      window.pageYOffset ??
      document.documentElement.scrollTop ??
      document.body.scrollTop ??
      0;
    const shouldShow = currentScroll > 120;
    buttons.forEach((btn) => {
      btn.classList.toggle('is-visible', shouldShow);
    });
  };

  const updateOffset = () => {
    const targetSection =
      document.querySelector('.resource-section') ??
      document.querySelector('.overview-section');
    if (!targetSection) return;
    const rect = targetSection.getBoundingClientRect();
    const rightMargin = Math.max(0, window.innerWidth - rect.right);
    const buttonWidth = buttons[0]?.offsetWidth ?? 48;
    const desiredGap = GAP_PT * PT_TO_PX;
    const offset = Math.max(4, rightMargin - desiredGap - buttonWidth);
    root.style.setProperty('--scroll-btn-offset', `${offset}px`);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  window.addEventListener('resize', () => {
    toggleVisibility();
    updateOffset();
  });
  toggleVisibility();
  updateOffset();
};

const initDescTooltips = () => {
  const tooltip = document.createElement('div');
  tooltip.className = 'desc-tooltip';
  document.body.appendChild(tooltip);

  const descriptions = document.querySelectorAll('.resource-description');
  descriptions.forEach((desc) => {
    const fullText = desc.getAttribute('data-full-text');
    if (!fullText) return;

    let isActive = false;

    const updateTooltipPosition = (e) => {
      if (!isActive) return;
      
      const tooltipRect = tooltip.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width || 420;
      const tooltipHeight = tooltipRect.height || 100;
      const offsetX = 20;
      const offsetY = 15;
      
      // 统一在鼠标右侧显示
      let left = e.clientX + offsetX;
      let top = e.clientY - tooltipHeight / 2;
      
      // 如果右侧空间不足，显示在鼠标左侧
      if (left + tooltipWidth > window.innerWidth - 20) {
        left = e.clientX - tooltipWidth - offsetX;
      }
      
      // 确保不超出视口底部
      if (top + tooltipHeight > window.innerHeight - 20) {
        top = window.innerHeight - tooltipHeight - 20;
      }
      
      // 确保不超出视口顶部
      if (top < 20) top = 20;
      
      // 确保不超出视口左侧
      if (left < 20) left = 20;

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    desc.addEventListener('mouseenter', (e) => {
      // 检查是否被截断：scrollHeight > clientHeight 表示有内容溢出
      const isTruncated = desc.scrollHeight > desc.clientHeight + 1;
      if (!isTruncated) return;

      tooltip.textContent = fullText;
      tooltip.classList.add('is-visible');
      isActive = true;
      
      // 等待DOM更新后再计算位置
      requestAnimationFrame(() => {
        updateTooltipPosition(e);
      });
    });

    desc.addEventListener('mousemove', updateTooltipPosition);

    desc.addEventListener('mouseleave', () => {
      isActive = false;
      tooltip.classList.remove('is-visible');
    });
  });
};

const initPageTools = () => {
  const copyButtons = document.querySelectorAll('[data-action="copy-page-link"]');
  if (!copyButtons.length) return;

  const copyToClipboard = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const succeeded = document.execCommand
      ? document.execCommand('copy')
      : false;
    document.body.removeChild(textarea);
    return succeeded;
  };

  copyButtons.forEach((button) => {
    const originalLabel = button.textContent.trim();
    button.addEventListener('click', async () => {
      const copied = await copyToClipboard(window.location.href);
      if (copied) {
        button.textContent = '链接已复制';
        button.classList.add('is-success');
        setTimeout(() => {
          button.textContent = originalLabel;
          button.classList.remove('is-success');
        }, 1800);
      } else {
        window.prompt('复制失败，请手动复制：', window.location.href);
      }
    });
  });
};

// 博物馆页面相关功能
const renderMuseumCard = (museum) => {
  return `
    <article class="resource-card museum-card">
      <div class="card-media">
        <img class="resource-logo" src="${museum.logo}" alt="${museum.name} logo" width="100" height="100" loading="lazy" decoding="async" onerror="this.src='assets/brand/site-logo.svg'" />
      </div>
      <div class="resource-meta">
        <h3>${museum.name}</h3>
      </div>
      <p class="resource-description" data-full-text="${museum.description}">馆藏特色：${museum.description}</p>
      <div class="card-actions">
        <a class="card-link" href="${museum.url}" target="_blank" rel="noreferrer">访问官网 →</a>
      </div>
    </article>
  `;
};

const initMuseumPage = () => {
  const categoryTabsContainer = document.getElementById('category-tabs');
  const museumGrid = document.getElementById('museum-grid');
  const regionCountEl = document.getElementById('current-region-count');
  const scrollWrapper = document.querySelector('.museum-filter-bar .filter-scroll-wrapper');
  const prevBtn = document.getElementById('museum-tab-prev');
  const nextBtn = document.getElementById('museum-tab-next');

  if (!categoryTabsContainer || !museumGrid) return;

  let currentCategory = museumCategories[0]?.id || 'guangdong';

  const updateArrowState = () => {
    if (!scrollWrapper || !prevBtn || !nextBtn) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollWrapper;
    const maxScroll = scrollWidth - clientWidth;
    prevBtn.disabled = scrollLeft <= 4;
    nextBtn.disabled = scrollLeft >= maxScroll - 4;
  };

  const scrollTabs = (direction = 1) => {
    if (!scrollWrapper) return;
    const amount = 220;
    scrollWrapper.scrollBy({ left: direction * amount, behavior: 'smooth' });
    setTimeout(updateArrowState, 320);
  };

  // 渲染分类标签
  const renderCategoryTabs = () => {
    categoryTabsContainer.innerHTML = museumCategories
      .map(
        (cat) => `
        <button 
          class="category-tab${cat.id === currentCategory ? ' is-active' : ''}" 
          data-category="${cat.id}"
          aria-pressed="${cat.id === currentCategory}"
        >
          ${cat.displayName}
        </button>
      `
      )
      .join('');
  };

  // 渲染博物馆卡片
  const renderMuseums = (categoryId) => {
    const museums = museumResources[categoryId] || [];

    museumGrid.innerHTML = museums.map(renderMuseumCard).join('');

    if (regionCountEl) {
      regionCountEl.textContent = `博物馆数量: ${museums.length}`;
    }

    // 重新初始化tooltip
    initDescTooltipsForMuseum();
  };

  // 为博物馆页面重新绑定tooltip
  const initDescTooltipsForMuseum = () => {
    const tooltip = document.querySelector('.desc-tooltip') || (() => {
      const t = document.createElement('div');
      t.className = 'desc-tooltip';
      document.body.appendChild(t);
      return t;
    })();

    const descriptions = museumGrid.querySelectorAll('.resource-description');
    descriptions.forEach((desc) => {
      const fullText = desc.getAttribute('data-full-text');
      if (!fullText) return;

      let isActive = false;

      const updateTooltipPosition = (e) => {
        if (!isActive) return;
        
        const tooltipRect = tooltip.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width || 420;
        const tooltipHeight = tooltipRect.height || 100;
        const offsetX = 20;
        
        // 统一在鼠标右侧显示
        let left = e.clientX + offsetX;
        let top = e.clientY - tooltipHeight / 2;
        
        // 如果右侧空间不足，显示在鼠标左侧
        if (left + tooltipWidth > window.innerWidth - 20) {
          left = e.clientX - tooltipWidth - offsetX;
        }
        
        // 确保不超出视口底部
        if (top + tooltipHeight > window.innerHeight - 20) {
          top = window.innerHeight - tooltipHeight - 20;
        }
        
        // 确保不超出视口顶部
        if (top < 20) top = 20;
        
        // 确保不超出视口左侧
        if (left < 20) left = 20;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      };

      desc.addEventListener('mouseenter', (e) => {
        const isTruncated = desc.scrollHeight > desc.clientHeight + 1;
        if (!isTruncated) return;

        tooltip.textContent = fullText;
        tooltip.classList.add('is-visible');
        isActive = true;
        
        requestAnimationFrame(() => {
          updateTooltipPosition(e);
        });
      });

      desc.addEventListener('mousemove', updateTooltipPosition);

      desc.addEventListener('mouseleave', () => {
        isActive = false;
        tooltip.classList.remove('is-visible');
      });
    });
  };

  // 处理分类切换
  const handleCategoryClick = (e) => {
    const button = e.target.closest('.category-tab');
    if (!button) return;

    const categoryId = button.dataset.category;
    if (categoryId === currentCategory) return;

    currentCategory = categoryId;

    // 更新激活状态
    categoryTabsContainer.querySelectorAll('.category-tab').forEach((tab) => {
      const isActive = tab.dataset.category === categoryId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-pressed', isActive.toString());
    });

    // 渲染新分类的博物馆
    renderMuseums(categoryId);
  };

  // 初始化
  renderCategoryTabs();
  renderMuseums(currentCategory);
  categoryTabsContainer.addEventListener('click', handleCategoryClick);

  if (prevBtn) prevBtn.addEventListener('click', () => scrollTabs(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollTabs(1));
  if (scrollWrapper) {
    scrollWrapper.addEventListener('scroll', updateArrowState, { passive: true });
    updateArrowState();
  }
};

// 影视片页面相关功能
const renderFilmCard = (film) => {
  const tags = (film.tags || [])
    .map((tag) => `<span class="chip">${tag}</span>`)
    .join('');
  const tagsMarkup = tags ? `<div class="tags-row">${tags}</div>` : '';

  return `
    <article class="resource-card film-card">
      <div class="card-media">
        <img class="film-poster" src="${film.logo}" alt="${film.name} 海报" width="260" height="280" loading="lazy" decoding="async" onerror="this.src='assets/brand/site-logo.svg'" />
      </div>
      <div class="resource-meta">
        <h3>${film.name}</h3>
      </div>
      <p class="resource-description" data-full-text="${film.description}">${film.description}</p>
      ${tagsMarkup}
      <div class="card-actions">
        <a class="card-link" href="${film.url}" target="_blank" rel="noreferrer">在线观看 →</a>
      </div>
    </article>
  `;
};

const initFilmPage = () => {
  const categoryTabsContainer = document.getElementById('film-category-tabs');
  const filmGrid = document.getElementById('film-grid');
  const categoryNameEl = document.getElementById('current-film-category');
  const categoryCountEl = document.getElementById('current-film-count');
  const totalCountEl = document.getElementById('film-total-count');

  if (!categoryTabsContainer || !filmGrid) return;

  let currentCategory = filmCategories[0]?.id || 'movie';

  // 计算总数
  const totalFilms = Object.values(filmResources).reduce(
    (sum, films) => sum + films.length,
    0
  );
  if (totalCountEl) {
    totalCountEl.textContent = `${totalFilms}+`;
  }

  // 渲染分类标签
  const renderCategoryTabs = () => {
    categoryTabsContainer.innerHTML = filmCategories
      .map(
        (cat) => `
        <button 
          class="film-category-tab${cat.id === currentCategory ? ' is-active' : ''}" 
          data-category="${cat.id}"
          aria-pressed="${cat.id === currentCategory}"
        >
          ${cat.displayName}
        </button>
      `
      )
      .join('');
  };

  // 纪录片子分类定义
  const documentarySubCategories = [
    { id: 'overview', name: '综合博览与地域文化' },
    { id: 'craftsman', name: '匠人精神与传承故事' },
    { id: 'theme', name: '主题专项与文化探索' },
    { id: 'history', name: '历史脉络与文明交流' },
  ];

  // 渲染影视卡片
  const renderFilms = (categoryId) => {
    const films = filmResources[categoryId] || [];
    const category = filmCategories.find((c) => c.id === categoryId);

    // 如果是纪录片，按子分类分组显示
    if (categoryId === 'documentary') {
      const groupedFilms = {
        '综合博览与地域文化': [],
        '匠人精神与传承故事': [],
        '主题专项与文化探索': [],
        '历史脉络与文明交流': [],
      };

      // 按分类分组
      films.forEach((film) => {
        const cat = film.category || '综合博览与地域文化';
        if (groupedFilms[cat]) {
          groupedFilms[cat].push(film);
        }
      });

      // 渲染分组后的内容
      let html = '';
      documentarySubCategories.forEach((subCat) => {
        const subFilms = groupedFilms[subCat.name] || [];
        if (subFilms.length > 0) {
          html += `
            <div class="documentary-group">
              <div class="documentary-group-header">
                <h3 class="group-title">${subCat.name}</h3>
                <span class="group-count">${subFilms.length} 部</span>
              </div>
              <div class="documentary-group-grid">
                ${subFilms.map(renderFilmCard).join('')}
              </div>
            </div>
          `;
        }
      });

      filmGrid.innerHTML = html;
      filmGrid.classList.add('documentary-grouped');
    } else {
      filmGrid.innerHTML = films.map(renderFilmCard).join('');
      filmGrid.classList.remove('documentary-grouped');
    }

    if (categoryNameEl) {
      categoryNameEl.textContent = category?.name || categoryId;
    }
    if (categoryCountEl) {
      categoryCountEl.textContent = `影片数量: ${films.length}`;
    }

    // 重新初始化tooltip
    initDescTooltipsForFilm();
  };

  // 为影视片页面重新绑定tooltip
  const initDescTooltipsForFilm = () => {
    const tooltip = document.querySelector('.desc-tooltip') || (() => {
      const t = document.createElement('div');
      t.className = 'desc-tooltip';
      document.body.appendChild(t);
      return t;
    })();

    const descriptions = filmGrid.querySelectorAll('.resource-description');
    descriptions.forEach((desc) => {
      const fullText = desc.getAttribute('data-full-text');
      if (!fullText) return;

      let isActive = false;

      const updateTooltipPosition = (e) => {
        if (!isActive) return;
        
        const tooltipRect = tooltip.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width || 420;
        const tooltipHeight = tooltipRect.height || 100;
        const offsetX = 20;
        
        // 统一在鼠标右侧显示
        let left = e.clientX + offsetX;
        let top = e.clientY - tooltipHeight / 2;
        
        // 如果右侧空间不足，显示在鼠标左侧
        if (left + tooltipWidth > window.innerWidth - 20) {
          left = e.clientX - tooltipWidth - offsetX;
        }
        
        // 确保不超出视口底部
        if (top + tooltipHeight > window.innerHeight - 20) {
          top = window.innerHeight - tooltipHeight - 20;
        }
        
        // 确保不超出视口顶部
        if (top < 20) top = 20;
        
        // 确保不超出视口左侧
        if (left < 20) left = 20;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      };

      desc.addEventListener('mouseenter', (e) => {
        const isTruncated = desc.scrollHeight > desc.clientHeight + 1;
        if (!isTruncated) return;

        tooltip.textContent = fullText;
        tooltip.classList.add('is-visible');
        isActive = true;
        
        requestAnimationFrame(() => {
          updateTooltipPosition(e);
        });
      });

      desc.addEventListener('mousemove', updateTooltipPosition);

      desc.addEventListener('mouseleave', () => {
        isActive = false;
        tooltip.classList.remove('is-visible');
      });
    });
  };

  // 处理分类切换
  const handleCategoryClick = (e) => {
    const button = e.target.closest('.film-category-tab');
    if (!button) return;

    const categoryId = button.dataset.category;
    if (categoryId === currentCategory) return;

    currentCategory = categoryId;

    // 更新激活状态
    categoryTabsContainer.querySelectorAll('.film-category-tab').forEach((tab) => {
      const isActive = tab.dataset.category === categoryId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-pressed', isActive.toString());
    });

    // 渲染新分类的影视作品
    renderFilms(categoryId);
  };

  // 初始化
  renderCategoryTabs();
  renderFilms(currentCategory);
  categoryTabsContainer.addEventListener('click', handleCategoryClick);
};

// 书籍页面相关功能
const renderBookCard = (book) => {
  const tags = (book.tags || [])
    .map((tag) => `<span class="chip">${tag}</span>`)
    .join('');
  const tagsMarkup = tags ? `<div class="tags-row">${tags}</div>` : '';

  return `
    <article class="resource-card book-card">
      <div class="card-media">
        <img class="book-cover" src="${book.cover}" alt="${book.name} 封面" width="200" height="300" loading="lazy" decoding="async" onerror="this.src='assets/brand/site-logo.svg'" />
      </div>
      <div class="resource-meta">
        <h3>${book.name}</h3>
      </div>
      <p class="resource-description" data-full-text="${book.description}">${book.description}</p>
      ${tagsMarkup}
      <div class="card-actions">
        <a class="card-link" href="${book.url}" target="_blank" rel="noreferrer">查看详情 →</a>
      </div>
    </article>
  `;
};

const initBooksPage = () => {
  const categoryTabsContainer = document.getElementById('books-category-tabs');
  const booksGrid = document.getElementById('books-grid');
  const categoryCountEl = document.getElementById('current-books-count');
  const totalCountEl = document.getElementById('books-total-count');

  if (!categoryTabsContainer || !booksGrid) return;

  let currentCategory = 'all';

  // 计算总数
  const totalBooks = Object.values(bookResources).reduce(
    (sum, books) => sum + books.length,
    0
  );
  if (totalCountEl) {
    totalCountEl.textContent = `${totalBooks}`;
  }

  // 渲染分类标签
  const renderCategoryTabs = () => {
    const allTab = `
      <button 
        class="books-category-tab${currentCategory === 'all' ? ' is-active' : ''}" 
        data-category="all"
        aria-pressed="${currentCategory === 'all'}"
      >
        全部书籍
      </button>
    `;
    
    const categoryTabs = bookCategories
      .map(
        (cat) => `
        <button 
          class="books-category-tab${cat.id === currentCategory ? ' is-active' : ''}" 
          data-category="${cat.id}"
          aria-pressed="${cat.id === currentCategory}"
        >
          ${cat.displayName}
        </button>
      `
      )
      .join('');
    
    categoryTabsContainer.innerHTML = allTab + categoryTabs;
  };

  // 渲染书籍卡片
  const renderBooks = (categoryId) => {
    let books = [];
    
    if (categoryId === 'all') {
      // 获取所有书籍
      Object.values(bookResources).forEach((categoryBooks) => {
        books = books.concat(categoryBooks);
      });
    } else {
      books = bookResources[categoryId] || [];
    }

    booksGrid.innerHTML = books.map(renderBookCard).join('');

    if (categoryCountEl) {
      categoryCountEl.textContent = `书籍数量: ${books.length}`;
    }

    // 重新初始化tooltip
    initDescTooltipsForBooks();
  };

  // 为书籍页面重新绑定tooltip
  const initDescTooltipsForBooks = () => {
    const tooltip = document.querySelector('.desc-tooltip') || (() => {
      const t = document.createElement('div');
      t.className = 'desc-tooltip';
      document.body.appendChild(t);
      return t;
    })();

    const descriptions = booksGrid.querySelectorAll('.resource-description');
    descriptions.forEach((desc) => {
      const fullText = desc.getAttribute('data-full-text');
      if (!fullText) return;

      let isActive = false;

      const updateTooltipPosition = (e) => {
        if (!isActive) return;
        
        const tooltipRect = tooltip.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width || 420;
        const tooltipHeight = tooltipRect.height || 100;
        const offsetX = 20;
        
        // 统一在鼠标右侧显示
        let left = e.clientX + offsetX;
        let top = e.clientY - tooltipHeight / 2;
        
        // 如果右侧空间不足，显示在鼠标左侧
        if (left + tooltipWidth > window.innerWidth - 20) {
          left = e.clientX - tooltipWidth - offsetX;
        }
        
        // 确保不超出视口底部
        if (top + tooltipHeight > window.innerHeight - 20) {
          top = window.innerHeight - tooltipHeight - 20;
        }
        
        // 确保不超出视口顶部
        if (top < 20) top = 20;
        
        // 确保不超出视口左侧
        if (left < 20) left = 20;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      };

      desc.addEventListener('mouseenter', (e) => {
        const isTruncated = desc.scrollHeight > desc.clientHeight + 1;
        if (!isTruncated) return;

        tooltip.textContent = fullText;
        tooltip.classList.add('is-visible');
        isActive = true;
        
        requestAnimationFrame(() => {
          updateTooltipPosition(e);
        });
      });

      desc.addEventListener('mousemove', updateTooltipPosition);

      desc.addEventListener('mouseleave', () => {
        isActive = false;
        tooltip.classList.remove('is-visible');
      });
    });
  };

  // 处理分类切换
  const handleCategoryClick = (e) => {
    const button = e.target.closest('.books-category-tab');
    if (!button) return;

    const categoryId = button.dataset.category;
    if (categoryId === currentCategory) return;

    currentCategory = categoryId;

    // 更新激活状态
    categoryTabsContainer.querySelectorAll('.books-category-tab').forEach((tab) => {
      const isActive = tab.dataset.category === categoryId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-pressed', isActive.toString());
    });

    // 渲染新分类的书籍
    renderBooks(categoryId);
  };

  // 初始化
  renderCategoryTabs();
  renderBooks(currentCategory);
  categoryTabsContainer.addEventListener('click', handleCategoryClick);
};

// 设计项目页面相关功能
const renderDesignProjectCard = (project) => {
  const tags = (project.tags || [])
    .map((tag) => `<span class="chip">${tag}</span>`)
    .join('');
  const tagsMarkup = tags ? `<div class="design-project-tags">${tags}</div>` : '';

  // 额外链接按钮
  const extraLink = project.extraUrl
    ? `<a class="design-project-link secondary" href="${project.extraUrl}" target="_blank" rel="noreferrer">${project.extraUrlName || '相关链接'} →</a>`
    : '';

  return `
    <article class="design-project-card">
      <div class="design-project-cover">
        <img src="${project.cover}" alt="${project.name} 封面" width="320" height="240" loading="lazy" decoding="async" onerror="this.src='assets/brand/site-logo.svg'" />
      </div>
      <div class="design-project-info">
        <h3>${project.name}</h3>
        <p class="design-project-description">${project.description}</p>
        ${tagsMarkup}
        <div class="design-project-actions">
          <a class="design-project-link primary" href="${project.url}" target="_blank" rel="noreferrer">了解详情 →</a>
          ${extraLink}
        </div>
      </div>
    </article>
  `;
};

const initDesignPage = () => {
  const designGrid = document.getElementById('design-grid');

  if (!designGrid) return;

  // 渲染设计项目卡片
  designGrid.innerHTML = designProjects.map(renderDesignProjectCard).join('');
};

// 设计工作室页面相关功能
const renderStudioCard = (studio) => {
  const tags = (studio.tags || [])
    .map((tag) => `<span class="chip">${tag}</span>`)
    .join('');
  const tagsMarkup = tags ? `<div class="studio-tags">${tags}</div>` : '';

  // 额外信息（如微信号等），直接拼接在描述末尾
  const description = studio.extraInfo
    ? `${studio.description}<span class="studio-extra-info">${studio.extraInfo}</span>`
    : studio.description;

  return `
    <article class="studio-card">
      <div class="studio-logo">
        <img src="${studio.logo}" alt="${studio.name} logo" width="180" height="180" loading="lazy" decoding="async" onerror="this.src='assets/brand/site-logo.svg'" />
      </div>
      <div class="studio-info">
        <div class="studio-header">
          <h3>${studio.name}</h3>
          <span class="studio-founder">主理人：${studio.founder}</span>
        </div>
        <p class="studio-description">${description}</p>
        ${tagsMarkup}
        <div class="studio-actions">
          <a class="studio-link primary" href="${studio.url}" target="_blank" rel="noreferrer">访问主页 →</a>
        </div>
      </div>
    </article>
  `;
};

const initStudioPage = () => {
  const studioGrid = document.getElementById('studio-grid');

  if (!studioGrid) return;

  // 渲染工作室卡片
  studioGrid.innerHTML = studioResources.map(renderStudioCard).join('');
};

document.addEventListener('DOMContentLoaded', () => {
  initSections();
  initSmoothScroll();
  initScrollTopButtons();
  initPageTools();
  initDescTooltips();
  initMuseumPage();
  initFilmPage();
  initBooksPage();
  initDesignPage();
  initStudioPage();
  initSearch();
});

