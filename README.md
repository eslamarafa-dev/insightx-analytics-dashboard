# 🎯 InsightX - Analytics Dashboard

GO Live Preview : https://eslamarafa-dev.github.io/insightx-analytics-dashboard/


A premium, real-time analytics dashboard built with **pure Vanilla JavaScript** (no frameworks, no chart libraries). InsightX helps teams visualize and understand operational data clearly with a modern, performance-conscious UI.

![InsightX Dashboard](https://img.shields.io/badge/InsightX-Analytics%20Dashboard-blue?style=for-the-badge&logo=analytics)
![Pure JS](https://img.shields.io/badge/Pure%20Vanilla-JavaScript-yellow?style=for-the-badge&logo=javascript)
![No Frameworks](https://img.shields.io/badge/No-Frameworks-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)

---

## ✨ Features

### 📊 Data Visualization
- **KPI Cards** with animated count-up numbers and sparklines
- **Performance Trend** bar chart (built with pure DOM, no libraries)
- **Category Distribution** with animated progress bars
- **Real-time metrics** with delta indicators (% change)

### 🔍 Filters & Search
- **Date Range** filter (Today, Yesterday, Week, Month, Quarter, Year)
- **Category Filters** (Sales, Marketing, Operations, Support)
- **Live Search** across all activity fields (user, action, category, value)
- **Mobile Drawer** for filters on small screens

### 📋 Activity Management
- **Paginated Activity Table** (7 rows per page)
- **Edit Activity** functionality (inline modal)
- **Export to CSV** for current page
- **Filter-aware** data display

### 🎨 UI/UX
- **Glassmorphism Design** with subtle gradients
- **Dark/Light Mode** with system preference detection
- **Micro-interactions** and hover feedback
- **Toast Notifications** for all actions
- **Smooth Animations** (fade-in, count-up, bar growth)

### ♿ Accessibility
- **Keyboard Shortcuts** (Ctrl+R, Ctrl+F, Esc)
- **Focus Management** and ARIA labels
- **Reduced Motion** support
- **Skip to Content** link

### ⚡ Performance
- **State-driven Architecture** (single source of truth)
- **RAF Batching** for optimized DOM updates
- **DocumentFragment** for bulk rendering
- **Text Diffing** to minimize reflows

---

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs directly from files

### Installation

1. **Clone or download the project:**
```bash
git clone https://github.com/yourusername/insightx-dashboard.git
cd insightx-dashboard
```

2. **Open in browser:**
```bash
# Simply open the HTML file
open index.html

# Or use a local server (optional)
npx serve
# Then visit http://localhost:3000
```

3. **That's it!** 🎉

---

## 📁 Project Structure

```
insightx-dashboard/
├── index.html          # Main dashboard (HTML + CSS + JS)
├── README.md           # This file
└── assets/             # Optional assets folder
    └── favicon.svg     # Custom favicon
```

---

## 🎮 Usage Guide

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + R` | Refresh data |
| `Ctrl/Cmd + F` | Focus search box |
| `Esc` | Close modals/drawers |

### Filter System

1. **Date Range**: Select from dropdown (Today, Yesterday, Week, etc.)
2. **Categories**: Toggle Sales, Marketing, Operations, Support
3. **Apply**: Click "Apply" to refresh data with filters
4. **Reset**: Click "Reset" to restore defaults

### Activity Table

- **Edit**: Click the edit button (pencil icon) to modify a row
- **Search**: Type in the search box to filter activities
- **Pagination**: Use Previous/Next buttons to navigate
- **Export**: Click "Export" to download CSV of current page

---

## 🏗️ Architecture

### State Management

```javascript
const DashboardState = {
  filters: {
    dateRange: 'week',
    categories: new Set(['sales', 'marketing', 'operations', 'support'])
  },
  ui: {
    theme: 'light',
    searchTerm: '',
    isLoading: false
  },
  data: {
    summary: { totalRevenue, activeUsers, conversionRate, ... },
    performance: [...],
    categories: [...],
    activities: [...],
    pagination: { currentPage, pageSize, totalItems }
  }
};
```

### Data Flow

```
User Action → Update State → Compute Views → Render UI
     ↓              ↓              ↓           ↓
  Button Click  DashboardState  filterData()  render()
```

### Performance Optimizations

1. **RequestAnimationFrame Batching**: All DOM updates are scheduled via RAF
2. **DocumentFragment**: Table rows are built in fragments before insertion
3. **Text Diffing**: Only update text content when values change
4. **Event Delegation**: Single event listener for dynamic elements

---

## 🎨 Customization

### Colors & Themes

Edit the `:root` variables in the CSS:

```css
:root {
  --accent: #2563eb;       /* Primary accent color */
  --accent-2: #14b8a6;     /* Secondary accent */
  --success: #10b981;      /* Success green */
  --warning: #f59e0b;      /* Warning amber */
  --danger: #ef4444;       /* Danger red */
}
```

### Adding New Categories

1. Add the category to the filter list in HTML
2. Update the `DashboardState.filters.categories` Set
3. Add category data generation in `generateData()`
4. Update `categoryBadge()` function for styling

### Modifying Metrics

Edit the `generateData()` function to:
- Change data ranges
- Add new metrics
- Adjust multipliers for date ranges

---

## 📱 Responsive Design

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 768px) | Single column, drawer filters |
| Tablet (768-1024px) | 2-column grid, sidebar filters |
| Desktop (> 1024px) | Full dashboard with sidebar |

---

## 🧪 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 88+ |
| Firefox | 85+ |
| Safari | 14+ |
| Edge | 88+ |

---

## 📄 License

MIT License - feel free to use in your projects!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For questions or issues, please open a GitHub issue.

---

## 🙏 Credits

- **Icons**: Font Awesome 6.4.0
- **Styles**: Tailwind CSS (via CDN for utilities)
- **Fonts**: Inter (Google Fonts)
- **Built with**: Pure HTML, CSS, and Vanilla JavaScript

---

**Made with ❤️ by InsightX Team**

![InsightX Logo](data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>)
