/* 
 * InsightX Analytics Dashboard - Main JavaScript
 * Data-driven interface with dynamic updates
 */

// Dashboard State Management
const DashboardState = {
    // Current filters
    filters: {
        dateRange: 'week',
        categories: ['all', 'sales', 'marketing', 'operations', 'support']
    },
    
    // Current data
    data: {
        summary: {},
        performance: [],
        categories: [],
        activities: [],
        pagination: {
            currentPage: 1,
            pageSize: 5,
            totalItems: 0
        }
    },
    
    // UI state
    ui: {
        isLoading: false,
        lastUpdated: new Date()
    }
};

// DOM Elements Cache
const DOM = {
    // Summary cards
    totalRevenue: document.getElementById('total-revenue'),
    activeUsers: document.getElementById('active-users'),
    conversionRate: document.getElementById('conversion-rate'),
    
    // Quick stats
    quickDataPoints: document.getElementById('quick-data-points'),
    quickActiveUsers: document.getElementById('quick-active-users'),
    quickAvgSession: document.getElementById('quick-avg-session'),
    quickCompletion: document.getElementById('quick-completion'),
    
    // Filters
    dateRangeSelect: document.getElementById('date-range'),
    categoryCheckboxes: document.querySelectorAll('input[name="category"]'),
    applyFiltersBtn: document.getElementById('apply-filters'),
    resetFiltersBtn: document.getElementById('reset-filters'),
    refreshBtn: document.getElementById('refresh-btn'),
    
    // Visualization containers
    chartContainer: document.getElementById('chart-container'),
    categoryDistribution: document.getElementById('category-distribution'),
    
    // Activity table
    activityTable: document.getElementById('activity-table'),
    shownActivities: document.getElementById('shown-activities'),
    totalActivities: document.getElementById('total-activities'),
    prevPageBtn: document.getElementById('prev-page'),
    nextPageBtn: document.getElementById('next-page'),
    
    // Last updated
    lastUpdatedSpan: document.getElementById('last-updated'),
    
    // Total items
    totalItems: document.getElementById('total-items')
};

// Initialize the dashboard
function initDashboard() {
    console.log('InsightX Dashboard Initializing...');
    
    // Generate initial data
    generateData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial UI
    renderDashboard();
    
    // Start count-up animations
    setTimeout(() => {
        animateCounters();
    }, 300);
    
    console.log('Dashboard initialized successfully.');
}

// Generate mock data for the dashboard
function generateData() {
    console.log('Generating mock data...');
    
    // Summary data
    DashboardState.data.summary = {
        totalRevenue: 42560,
        activeUsers: 1247,
        conversionRate: 3.4,
        dataPoints: 8921,
        avgSession: '4m 32s',
        completionRate: 87
    };
    
    // Performance data (for chart)
    const performanceData = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    days.forEach(day => {
        performanceData.push({
            day,
            value: Math.floor(Math.random() * 100) + 50,
            trend: Math.random() > 0.5 ? 'up' : 'down'
        });
    });
    
    DashboardState.data.performance = performanceData;
    
    // Category distribution
    DashboardState.data.categories = [
        { name: 'Sales', value: 42, color: 'bg-blue-500' },
        { name: 'Marketing', value: 28, color: 'bg-green-500' },
        { name: 'Operations', value: 18, color: 'bg-purple-500' },
        { name: 'Support', value: 12, color: 'bg-amber-500' }
    ];
    
    // Activity data
    const activities = [];
    const users = ['Alex Johnson', 'Sam Rivera', 'Taylor Chen', 'Jordan Smith', 'Casey Kim', 'Morgan Lee'];
    const actions = ['Login', 'Purchase', 'Download', 'Upload', 'Comment', 'Share', 'View', 'Edit'];
    const categories = ['Sales', 'Marketing', 'Operations', 'Support'];
    
    for (let i = 0; i < 25; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const value = `$${Math.floor(Math.random() * 1000) + 50}`;
        const time = `${Math.floor(Math.random() * 60)} minutes ago`;
        
        activities.push({
            id: i + 1,
            user,
            action,
            category,
            value,
            time
        });
    }
    
    DashboardState.data.activities = activities;
    DashboardState.data.pagination.totalItems = activities.length;
    
    // Update last updated timestamp
    DashboardState.ui.lastUpdated = new Date();
}

// Set up all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Filter application
    DOM.applyFiltersBtn.addEventListener('click', applyFilters);
    
    // Filter reset
    DOM.resetFiltersBtn.addEventListener('click', resetFilters);
    
    // Date range change
    DOM.dateRangeSelect.addEventListener('change', function() {
        DashboardState.filters.dateRange = this.value;
        // Update UI to reflect change but don't apply yet
        highlightFilterChange();
    });
    
    // Category checkbox changes
    DOM.categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCategoryChange);
    });
    
    // Refresh button
    DOM.refreshBtn.addEventListener('click', refreshData);
    
    // Pagination buttons
    DOM.prevPageBtn.addEventListener('click', goToPrevPage);
    DOM.nextPageBtn.addEventListener('click', goToNextPage);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    console.log('Event listeners set up.');
}

// Handle category checkbox changes
function handleCategoryChange(e) {
    const checkbox = e.target;
    const value = checkbox.value;
    
    if (value === 'all') {
        // If "All" is checked, check all others
        if (checkbox.checked) {
            DOM.categoryCheckboxes.forEach(cb => {
                if (cb.value !== 'all') {
                    cb.checked = true;
                }
            });
        } else {
            // If "All" is unchecked, do nothing (can't uncheck all)
            checkbox.checked = true;
        }
    } else {
        // If any other checkbox is unchecked, uncheck "All"
        if (!checkbox.checked) {
            document.querySelector('input[name="category"][value="all"]').checked = false;
        }
        
        // If all non-"All" checkboxes are checked, check "All"
        const nonAllCheckboxes = Array.from(DOM.categoryCheckboxes).filter(cb => cb.value !== 'all');
        const allChecked = nonAllCheckboxes.every(cb => cb.checked);
        
        if (allChecked) {
            document.querySelector('input[name="category"][value="all"]').checked = true;
        }
    }
    
    highlightFilterChange();
}

// Apply filters to the dashboard
function applyFilters() {
    console.log('Applying filters...');
    
    // Get selected categories
    const selectedCategories = Array.from(DOM.categoryCheckboxes)
        .filter(cb => cb.checked && cb.value !== 'all')
        .map(cb => cb.value);
    
    // Update state
    DashboardState.filters.categories = selectedCategories.length > 0 ? selectedCategories : ['all'];
    DashboardState.filters.dateRange = DOM.dateRangeSelect.value;
    
    // Simulate filtering by generating new data based on filters
    filterData();
    
    // Update UI
    renderDashboard();
    
    // Reset filter change indicator
    DOM.applyFiltersBtn.classList.remove('bg-blue-700', 'animate-pulse');
    DOM.applyFiltersBtn.textContent = 'Apply Filters';
    
    // Show notification
    showNotification(`Filters applied: ${DOM.dateRangeSelect.options[DOM.dateRangeSelect.selectedIndex].text}, ${selectedCategories.length} categories`);
}

// Reset filters to default
function resetFilters() {
    console.log('Resetting filters...');
    
    // Reset UI
    DOM.dateRangeSelect.value = 'week';
    
    DOM.categoryCheckboxes.forEach(cb => {
        cb.checked = true;
    });
    
    // Reset state
    DashboardState.filters.dateRange = 'week';
    DashboardState.filters.categories = ['all', 'sales', 'marketing', 'operations', 'support'];
    
    // Regenerate original data
    generateData();
    
    // Update UI
    renderDashboard();
    
    // Reset filter change indicator
    DOM.applyFiltersBtn.classList.remove('bg-blue-700', 'animate-pulse');
    DOM.applyFiltersBtn.textContent = 'Apply Filters';
    
    // Show notification
    showNotification('Filters reset to default');
}

// Highlight that filters have changed but not applied
function highlightFilterChange() {
    DOM.applyFiltersBtn.classList.add('bg-blue-700', 'animate-pulse');
    DOM.applyFiltersBtn.textContent = 'Apply Filters *';
}

// Filter data based on current filters (simulated)
function filterData() {
    console.log('Filtering data based on current filters...');
    
    // In a real app, this would be an API call
    // For simulation, we'll adjust the summary data slightly based on filters
    
    const dateRange = DashboardState.filters.dateRange;
    const categories = DashboardState.filters.categories;
    
    // Adjust summary data based on date range
    let multiplier = 1;
    switch(dateRange) {
        case 'today':
            multiplier = 0.15;
            break;
        case 'yesterday':
            multiplier = 0.15;
            break;
        case 'week':
            multiplier = 1;
            break;
        case 'month':
            multiplier = 4;
            break;
        case 'quarter':
            multiplier = 12;
            break;
        case 'year':
            multiplier = 52;
            break;
    }
    
    DashboardState.data.summary.totalRevenue = Math.floor(42560 * multiplier);
    DashboardState.data.summary.activeUsers = Math.floor(1247 * multiplier);
    
    // Adjust category distribution based on selected categories
    if (!categories.includes('all')) {
        DashboardState.data.categories = DashboardState.data.categories.filter(cat => {
            const catLower = cat.name.toLowerCase();
            return categories.some(selected => catLower.includes(selected));
        });
    }
    
    // Adjust activities based on selected categories
    if (!categories.includes('all')) {
        DashboardState.data.activities = DashboardState.data.activities.filter(activity => {
            const activityCatLower = activity.category.toLowerCase();
            return categories.some(selected => activityCatLower.includes(selected));
        });
        DashboardState.data.pagination.totalItems = DashboardState.data.activities.length;
    }
    
    // Update last updated timestamp
    DashboardState.ui.lastUpdated = new Date();
}

// Refresh data from "server"
function refreshData() {
    console.log('Refreshing data...');
    
    // Show loading state
    DOM.refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i><span>Refreshing...</span>';
    DOM.refreshBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Generate new data
        generateData();
        
        // Apply current filters
        filterData();
        
        // Update UI
        renderDashboard();
        
        // Reset button
        DOM.refreshBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i><span>Refresh Data</span>';
        DOM.refreshBtn.disabled = false;
        
        // Show notification
        showNotification('Data refreshed successfully');
        
        // Animate counters
        animateCounters();
    }, 800);
}

// Render the entire dashboard
function renderDashboard() {
    console.log('Rendering dashboard...');
    
    // Update summary cards
    renderSummaryCards();
    
    // Update quick stats
    renderQuickStats();
    
    // Update performance chart
    renderPerformanceChart();
    
    // Update category distribution
    renderCategoryDistribution();
    
    // Update activity table
    renderActivityTable();
    
    // Update pagination controls
    updatePaginationControls();
    
    // Update last updated time
    updateLastUpdatedTime();
}

// Render summary cards with count-up animation
function renderSummaryCards() {
    const summary = DashboardState.data.summary;
    
    // Store target values for animation
    DOM.totalRevenue.setAttribute('data-target', summary.totalRevenue);
    DOM.activeUsers.setAttribute('data-target', summary.activeUsers);
    DOM.conversionRate.setAttribute('data-target', summary.conversionRate);
    
    // Set initial values (will be animated)
    DOM.totalRevenue.textContent = formatCurrency(0);
    DOM.activeUsers.textContent = '0';
    DOM.conversionRate.textContent = '0%';
}

// Animate counters with count-up effect
function animateCounters() {
    console.log('Animating counters...');
    
    const summary = DashboardState.data.summary;
    
    // Animate total revenue
    animateValue(DOM.totalRevenue, 0, summary.totalRevenue, 1500, formatCurrency);
    
    // Animate active users
    animateValue(DOM.activeUsers, 0, summary.activeUsers, 1500, (val) => Math.floor(val).toLocaleString());
    
    // Animate conversion rate
    animateValue(DOM.conversionRate, 0, summary.conversionRate, 1500, (val) => val.toFixed(1) + '%');
}

// Generic value animation function
function animateValue(element, start, end, duration, formatter) {
    const startTime = performance.now();
    const diff = end - start;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = start + diff * easeOutQuart;
        
        element.textContent = formatter(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatter(end);
        }
    }
    
    requestAnimationFrame(update);
}

// Render quick stats
function renderQuickStats() {
    const summary = DashboardState.data.summary;
    
    DOM.quickDataPoints.textContent = summary.dataPoints.toLocaleString();
    DOM.quickActiveUsers.textContent = summary.activeUsers.toLocaleString();
    DOM.quickAvgSession.textContent = summary.avgSession;
    DOM.quickCompletion.textContent = summary.completionRate + '%';
}

// Render performance chart
function renderPerformanceChart() {
    const performanceData = DashboardState.data.performance;
    
    // Clear container
    DOM.chartContainer.innerHTML = '';
    
    // Find max value for scaling
    const maxValue = Math.max(...performanceData.map(item => item.value));
    
    // Create bars
    performanceData.forEach(item => {
        const barHeight = (item.value / maxValue) * 80; // 80% of container height
        
        const barContainer = document.createElement('div');
        barContainer.className = 'flex flex-col items-center justify-end h-full';
        
        const bar = document.createElement('div');
        bar.className = `chart-bar w-8 md:w-10 rounded-t-lg ${item.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`;
        bar.style.height = '0'; // Start at 0 for animation
        bar.setAttribute('data-value', item.value);
        
        const label = document.createElement('p');
        label.className = 'mt-2 text-gray-600 text-sm';
        label.textContent = item.day;
        
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        DOM.chartContainer.appendChild(barContainer);
        
        // Animate bar height
        setTimeout(() => {
            bar.style.height = `${barHeight}%`;
        }, 100);
    });
}

// Render category distribution
function renderCategoryDistribution() {
    const categories = DashboardState.data.categories;
    
    // Clear container
    DOM.categoryDistribution.innerHTML = '';
    
    // Calculate total for percentage
    const total = categories.reduce((sum, cat) => sum + cat.value, 0);
    
    // Update total items
    DOM.totalItems.textContent = total.toLocaleString();
    
    // Create category bars
    categories.forEach(category => {
        const percentage = Math.round((category.value / total) * 100);
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'fade-in';
        
        categoryItem.innerHTML = `
            <div class="flex justify-between mb-1">
                <span class="font-medium">${category.name}</span>
                <span class="text-gray-600">${category.value} (${percentage}%)</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="category-bar h-2.5 rounded-full ${category.color}" style="width: 0;"></div>
            </div>
        `;
        
        DOM.categoryDistribution.appendChild(categoryItem);
        
        // Animate width
        setTimeout(() => {
            const bar = categoryItem.querySelector('.category-bar');
            if (bar) {
                bar.style.width = `${percentage}%`;
            }
        }, 200);
    });
}

// Render activity table with pagination
function renderActivityTable() {
    const activities = DashboardState.data.activities;
    const pagination = DashboardState.data.pagination;
    
    // Calculate slice for current page
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const currentActivities = activities.slice(startIndex, endIndex);
    
    // Clear table
    DOM.activityTable.innerHTML = '';
    
    // If no activities
    if (currentActivities.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" class="py-8 text-center text-gray-500">
                No activities found for the selected filters.
            </td>
        `;
        DOM.activityTable.appendChild(row);
        return;
    }
    
    // Create rows
    currentActivities.forEach(activity => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-100 hover:bg-gray-50 transition-colors';
        
        // Determine icon based on action
        let icon = 'fa-circle';
        let iconColor = 'text-gray-400';
        
        if (activity.action === 'Purchase') {
            icon = 'fa-shopping-cart';
            iconColor = 'text-green-500';
        } else if (activity.action === 'Login') {
            icon = 'fa-sign-in-alt';
            iconColor = 'text-blue-500';
        } else if (activity.action === 'Download') {
            icon = 'fa-download';
            iconColor = 'text-purple-500';
        } else if (activity.action === 'Upload') {
            icon = 'fa-upload';
            iconColor = 'text-amber-500';
        }
        
        row.innerHTML = `
            <td class="py-4">
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <i class="fas fa-user text-gray-600"></i>
                    </div>
                    <span class="font-medium">${activity.user}</span>
                </div>
            </td>
            <td class="py-4">
                <div class="flex items-center">
                    <i class="fas ${icon} ${iconColor} mr-2"></i>
                    <span>${activity.action}</span>
                </div>
            </td>
            <td class="py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium
                    ${activity.category === 'Sales' ? 'bg-blue-100 text-blue-800' : ''}
                    ${activity.category === 'Marketing' ? 'bg-green-100 text-green-800' : ''}
                    ${activity.category === 'Operations' ? 'bg-purple-100 text-purple-800' : ''}
                    ${activity.category === 'Support' ? 'bg-amber-100 text-amber-800' : ''}">
                    ${activity.category}
                </span>
            </td>
            <td class="py-4 font-medium">${activity.value}</td>
            <td class="py-4 text-gray-500">${activity.time}</td>
        `;
        
        DOM.activityTable.appendChild(row);
    });
    
    // Update shown/total counts
    DOM.shownActivities.textContent = currentActivities.length;
    DOM.totalActivities.textContent = activities.length;
}

// Update pagination controls
function updatePaginationControls() {
    const pagination = DashboardState.data.pagination;
    const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);
    
    // Enable/disable previous button
    DOM.prevPageBtn.disabled = pagination.currentPage <= 1;
    
    // Enable/disable next button
    DOM.nextPageBtn.disabled = pagination.currentPage >= totalPages;
}

// Go to previous page
function goToPrevPage() {
    if (DashboardState.data.pagination.currentPage > 1) {
        DashboardState.data.pagination.currentPage--;
        renderActivityTable();
        updatePaginationControls();
    }
}

// Go to next page
function goToNextPage() {
    const pagination = DashboardState.data.pagination;
    const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);
    
    if (pagination.currentPage < totalPages) {
        pagination.currentPage++;
        renderActivityTable();
        updatePaginationControls();
    }
}

// Update last updated time
function updateLastUpdatedTime() {
    const now = DashboardState.ui.lastUpdated;
    const diffMs = new Date() - now;
    const diffMins = Math.floor(diffMs / 60000);
    
    let text;
    if (diffMins < 1) {
        text = 'Just now';
    } else if (diffMins === 1) {
        text = '1 minute ago';
    } else if (diffMins < 60) {
        text = `${diffMins} minutes ago`;
    } else if (diffMins < 120) {
        text = '1 hour ago';
    } else {
        text = `${Math.floor(diffMins / 60)} hours ago`;
    }
    
    DOM.lastUpdatedSpan.textContent = text;
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full opacity-0 transition-all duration-300';
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('translate-x-0', 'opacity-100');
        notification.classList.add('translate-x-full', 'opacity-0');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + R to refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshData();
    }
    
    // Ctrl/Cmd + F to focus filters
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        DOM.dateRangeSelect.focus();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);