import { resourceSections } from './resources.js';
import { museumCategories, museumResources } from './museum-resources.js';
import { celebrityResources, internationalResources, redResources } from './section-resources.js';

const renderResourceCard = (resource) => {
  const tags = (resource.tags || [])
    .map((tag) => `<span class="chip">${tag}</span>`)
    .join('');

  const tagsMarkup = tags ? `<div class="tags-row">${tags}</div>` : '';
  const logoClass = resource.logoClass ? ` ${resource.logoClass}` : '';

  return `
    <article class="resource-card">
      <div class="card-media">
        <img class="resource-logo${logoClass}" src="${resource.logo}" alt="${resource.name} logo" loading="lazy" />
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

    desc.addEventListener('mouseenter', (e) => {
      // 检查是否被截断：scrollHeight > clientHeight 表示有内容溢出
      const isTruncated = desc.scrollHeight > desc.clientHeight + 1;
      if (!isTruncated) return;

      tooltip.textContent = fullText;
      const rect = desc.getBoundingClientRect();
      let left = rect.right + 12;
      let top = rect.top;

      // 如果右侧空间不足，显示在左侧
      if (left + 280 > window.innerWidth) {
        left = rect.left - 280 - 12;
      }
      // 确保不超出视口顶部
      if (top < 8) top = 8;
      // 确保不超出视口底部
      if (top + tooltip.offsetHeight > window.innerHeight - 8) {
        top = window.innerHeight - tooltip.offsetHeight - 8;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.classList.add('is-visible');
    });

    desc.addEventListener('mouseleave', () => {
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
        <img class="resource-logo" src="${museum.logo}" alt="${museum.name} logo" loading="lazy" onerror="this.src='assets/brand/site-logo.svg'" />
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
  const regionNameEl = document.getElementById('current-region-name');
  const regionCountEl = document.getElementById('current-region-count');

  if (!categoryTabsContainer || !museumGrid) return;

  let currentCategory = museumCategories[0]?.id || 'guangdong';

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
    const category = museumCategories.find((c) => c.id === categoryId);

    museumGrid.innerHTML = museums.map(renderMuseumCard).join('');

    if (regionNameEl) {
      regionNameEl.textContent = category?.name || categoryId;
    }
    if (regionCountEl) {
      regionCountEl.textContent = museums.length.toString();
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

      desc.addEventListener('mouseenter', () => {
        const isTruncated = desc.scrollHeight > desc.clientHeight + 1;
        if (!isTruncated) return;

        tooltip.textContent = fullText;
        const rect = desc.getBoundingClientRect();
        let left = rect.right + 12;
        let top = rect.top;

        if (left + 280 > window.innerWidth) {
          left = rect.left - 280 - 12;
        }
        if (top < 8) top = 8;
        if (top + tooltip.offsetHeight > window.innerHeight - 8) {
          top = window.innerHeight - tooltip.offsetHeight - 8;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.classList.add('is-visible');
      });

      desc.addEventListener('mouseleave', () => {
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
};

document.addEventListener('DOMContentLoaded', () => {
  initSections();
  initSmoothScroll();
  initScrollTopButtons();
  initPageTools();
  initDescTooltips();
  initMuseumPage();
});

