// Navigation function for subject cards
function navigateToSubject(subject) {
    window.location.href = `pages/${subject}.html`;
}

// Load and display progress for each subject on homepage
function loadHomepageProgress() {
    const subjects = ['physics', 'physical-chemistry', 'organic-chemistry', 'biology'];
    
    subjects.forEach(subject => {
        const progressElement = document.getElementById(`${subject}-progress`);
        if (progressElement) {
            const savedData = localStorage.getItem(`${subject}-data`);
            if (savedData) {
                const data = JSON.parse(savedData);
                const totalChapters = Object.values(data).reduce((total, column) => total + column.length, 0);
                const completedChapters = Object.values(data).reduce((total, column) => 
                    total + column.filter(chapter => chapter.completed).length, 0);
                
                const progressPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
                
                // Update progress indicator with enhanced visuals
                updateProgressIndicator(progressElement, progressPercentage, completedChapters, totalChapters);
            } else {
                // No data exists yet
                updateProgressIndicator(progressElement, 0, 0, 0);
            }
        }
    });
}

// Enhanced progress indicator function
function updateProgressIndicator(element, percentage, completed, total) {
    // Remove existing classes
    element.classList.remove('completed', 'in-progress', 'not-started', 'has-progress');
    
    // Set progress width CSS variable
    element.style.setProperty('--progress-width', `${percentage}%`);
    
    let statusText = '';
    let statusIcon = '';
    
    if (total === 0) {
        element.classList.add('not-started');
        statusText = 'Get Started!';
        statusIcon = '🚀';
    } else if (percentage === 100) {
        element.classList.add('completed');
        statusText = 'Complete!';
        statusIcon = '✅';
    } else if (percentage > 0) {
        element.classList.add('in-progress', 'has-progress');
        statusText = `${percentage}% Complete`;
        statusIcon = '📈';
    } else {
        element.classList.add('not-started');
        statusText = 'Not Started';
        statusIcon = '⏳';
    }
    
    // Create enhanced content with icon and details
    element.innerHTML = `
        <span>
            <span style="font-size: 1.1em; margin-right: 4px;">${statusIcon}</span>
            <span>${statusText}</span>
            ${total > 0 ? `<small style="display: block; font-size: 0.75em; opacity: 0.8; margin-top: 2px;">${completed}/${total} chapters</small>` : ''}
        </span>
    `;
}

// Initialize homepage
document.addEventListener('DOMContentLoaded', () => {
    loadHomepageProgress();
    
    // Refresh progress every 5 seconds in case user has multiple tabs open
    setInterval(loadHomepageProgress, 5000);
});