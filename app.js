// Gut Health Assessment App JavaScript

// Application State
const appState = {
    currentSection: 0,
    scores: {},
    sectionScores: [0, 0, 0, 0, 0],
    totalScore: 0,
    isComplete: false
};

// Assessment Data
const assessmentData = {
    sections: [
        {
            id: "1A",
            title: "Digestive Symptoms",
            subtitle: "Score each symptom from 0–4 (0 = Never, 1 = Rare, 2 = Sometimes, 3 = Often, 4 = Almost daily)",
            maxScore: 32,
            questions: [
                "Bloating/fullness after meals",
                "Abdominal pain/discomfort", 
                "Heartburn/acid reflux",
                "Excessive gas/burping",
                "Nausea/vomiting",
                "Constipation",
                "Loose stools/diarrhea",
                "Bristol Stool Chart (Type 1-2=3pts, Type 3-4=0pts, Type 5=2pts, Type 6-7=4pts)"
            ]
        },
        {
            id: "1B", 
            title: "Connected Health Symptoms",
            subtitle: "Same scoring system (0–4)",
            maxScore: 32,
            questions: [
                "Low energy/fatigue",
                "Brain fog or poor concentration", 
                "Mood swings/irritability",
                "Poor sleep quality",
                "Frequent headaches",
                "Skin issues (acne, eczema, rashes)",
                "Joint/muscle pains",
                "Irregular menstrual cycles (if applicable)"
            ]
        },
        {
            id: "2",
            title: "Lifestyle & Environmental Assessment", 
            subtitle: "Rate your lifestyle factors",
            maxScore: 28,
            questions: [
                "Vegetable/fruit servings daily (0=≥5, 1=3-4, 2=1-2, 3=<1, 4=Almost none)",
                "Ultra-processed food consumption (0=Never, 1=Rare, 2=Sometimes, 3=Often, 4=Daily)",
                "Water intake per day (0=>2.5L, 1=2-2.5L, 2=1.5-2L, 3=1-1.5L, 4=<1L)",
                "Sleep duration & quality (0=7-8h restful, 1=6-7h mostly restful, 2=5-6h unrestful, 3=<5h broken, 4=Severe insomnia)",
                "Stress levels (0=Calm, 1=Mild, 2=Moderate, 3=High anxiety, 4=Extreme overwhelming)",
                "Antibiotic use past 12 months (0=None, 2=Once, 3=Multiple, 4=>3 times)",
                "Long-term medication use (0=None, 2=Short-term, 3=Ongoing >6mo, 4=Multiple long-term)"
            ]
        },
        {
            id: "3",
            title: "Trigger Identification",
            subtitle: "Identify your gut health triggers (0=Never, 1=Rare, 2=Sometimes, 3=Often, 4=Always)",
            maxScore: 12,
            questions: [
                "Specific foods trigger bloating, gas, or reflux",
                "Stress/emotions trigger gut symptoms", 
                "Travel/irregular routine disturbs your gut"
            ]
        },
        {
            id: "4",
            title: "Quality of Life Impact",
            subtitle: "How gut issues affect your life (0-4 scale)",
            maxScore: 12,
            questions: [
                "Gut issues affect work productivity",
                "Gut issues affect social life/relationships",
                "How motivated are you to improve gut health? (0=Extremely, 1=Very, 2=Somewhat, 3=Mildly, 4=Not motivated)"
            ]
        }
    ],
    interpretations: [
        {
            range: [0, 50],
            level: "Optimal", 
            color: "#22c55e",
            description: "Foundation strong — focus on maintenance.",
            recommendations: ["Continue your healthy habits", "Monitor for any changes", "Consider preventive measures"]
        },
        {
            range: [51, 100],
            level: "Good with Improvement",
            color: "#fbbf24", 
            description: "Early intervention helpful.",
            recommendations: ["Focus on identified problem areas", "Consider dietary adjustments", "Implement stress management techniques"]
        },
        {
            range: [101, 150],
            level: "Moderate Concern",
            color: "#f97316",
            description: "Active management required.", 
            recommendations: ["Consult healthcare professional", "Consider comprehensive gut health program", "Address lifestyle factors urgently"]
        },
        {
            range: [151, 215],
            level: "High Priority", 
            color: "#ef4444",
            description: "Comprehensive reset needed — you'll benefit most from deeper protocols.",
            recommendations: ["Seek immediate professional guidance", "Consider specialized gut health testing", "Implement comprehensive intervention plan"]
        }
    ]
};

// Initialize the app
function initApp() {
    console.log('Initializing app...');
    
    // Initialize scores for all questions
    assessmentData.sections.forEach((section, sectionIndex) => {
        section.questions.forEach((question, questionIndex) => {
            const questionId = `${section.id}-${questionIndex}`;
            appState.scores[questionId] = 0;
        });
    });
    
    // Show welcome screen
    showScreen('welcome-screen');
    
    // Add event listeners
    setupEventListeners();
    
    console.log('App initialized successfully');
}

// Setup event listeners
function setupEventListeners() {
    // Add click event to start button
    const startBtn = document.querySelector('.start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startAssessment);
        console.log('Start button event listener added');
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Add beforeunload warning
    window.addEventListener('beforeunload', handleBeforeUnload);
}

// Screen management
function showScreen(screenId) {
    console.log(`Showing screen: ${screenId}`);
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.style.display = 'flex';
        setTimeout(() => {
            targetScreen.classList.add('active');
        }, 50);
        console.log(`Screen ${screenId} displayed successfully`);
    } else {
        console.error(`Screen ${screenId} not found`);
    }
}

// Start assessment
function startAssessment() {
    console.log('Starting assessment...');
    try {
        appState.currentSection = 0;
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
        showScreen('assessment-screen');
        renderCurrentSection();
        updateProgress();
        console.log('Assessment started successfully');
    } catch (error) {
        console.error('Error starting assessment:', error);
    }
}

// Render current section
function renderCurrentSection() {
    console.log(`Rendering section ${appState.currentSection}`);
    
    const section = assessmentData.sections[appState.currentSection];
    if (!section) {
        console.error('Section not found');
        return;
    }

    // Update section header
    const titleEl = document.getElementById('section-title');
    const subtitleEl = document.getElementById('section-subtitle');
    const maxScoreEl = document.getElementById('section-max-score');
    
    if (titleEl) titleEl.textContent = section.title;
    if (subtitleEl) subtitleEl.textContent = section.subtitle;
    if (maxScoreEl) maxScoreEl.textContent = `/ ${section.maxScore}`;

    // Render questions
    const questionsContainer = document.getElementById('questions-container');
    if (!questionsContainer) {
        console.error('Questions container not found');
        return;
    }
    
    questionsContainer.innerHTML = '';

    section.questions.forEach((question, questionIndex) => {
        const questionId = `${section.id}-${questionIndex}`;
        
        const questionElement = document.createElement('div');
        questionElement.className = 'question-item fade-in';
        questionElement.innerHTML = `
            <div class="question-text">${question}</div>
            <div class="scoring-buttons" id="buttons-${questionId}">
                ${[0, 1, 2, 3, 4].map(score => `
                    <button class="score-btn" data-score="${score}" data-question="${questionId}">
                        ${score}
                    </button>
                `).join('')}
            </div>
        `;
        
        questionsContainer.appendChild(questionElement);
        
        // Add event listeners to score buttons
        const scoreButtons = questionElement.querySelectorAll('.score-btn');
        scoreButtons.forEach(button => {
            button.addEventListener('click', () => {
                const score = parseInt(button.dataset.score);
                selectScore(questionId, score);
            });
        });
        
        // Set current score if exists
        const currentScore = appState.scores[questionId];
        if (currentScore !== undefined) {
            setTimeout(() => {
                updateScoreButton(questionId, currentScore);
            }, 100);
        }
    });

    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.style.display = appState.currentSection > 0 ? 'block' : 'none';
        prevBtn.onclick = previousSection;
    }
    
    if (nextBtn) {
        nextBtn.textContent = appState.currentSection < assessmentData.sections.length - 1 ? 'Next →' : 'View Results';
        nextBtn.onclick = nextSection;
    }
    
    updateSectionScore();
}

// Select score for a question
function selectScore(questionId, score) {
    console.log(`Selected score ${score} for question ${questionId}`);
    appState.scores[questionId] = score;
    updateScoreButton(questionId, score);
    updateSectionScore();
    
    // Add a small animation
    const button = document.querySelector(`button[data-question="${questionId}"][data-score="${score}"]`);
    if (button) {
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
}

// Update score button appearance
function updateScoreButton(questionId, selectedScore) {
    const buttonsContainer = document.getElementById(`buttons-${questionId}`);
    if (!buttonsContainer) return;
    
    const buttons = buttonsContainer.querySelectorAll('.score-btn');
    buttons.forEach(button => {
        button.classList.remove('active');
        const buttonScore = parseInt(button.dataset.score);
        if (buttonScore === selectedScore) {
            button.classList.add('active');
        }
    });
}

// Update section score
function updateSectionScore() {
    const section = assessmentData.sections[appState.currentSection];
    if (!section) return;
    
    let sectionScore = 0;
    section.questions.forEach((question, questionIndex) => {
        const questionId = `${section.id}-${questionIndex}`;
        sectionScore += appState.scores[questionId] || 0;
    });
    
    appState.sectionScores[appState.currentSection] = sectionScore;
    const scoreEl = document.getElementById('section-score');
    if (scoreEl) {
        scoreEl.textContent = sectionScore;
    }
    
    // Update total score
    appState.totalScore = appState.sectionScores.reduce((total, score) => total + score, 0);
}

// Update progress bar
function updateProgress() {
    const progress = ((appState.currentSection + 1) / assessmentData.sections.length) * 100;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    if (progressText) {
        progressText.textContent = `Section ${appState.currentSection + 1} of ${assessmentData.sections.length}`;
    }
}

// Navigation functions
function nextSection() {
    console.log('Next section clicked');
    if (appState.currentSection < assessmentData.sections.length - 1) {
        appState.currentSection++;
        renderCurrentSection();
        updateProgress();
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Show results
        showResults();
    }
}

function previousSection() {
    console.log('Previous section clicked');
    if (appState.currentSection > 0) {
        appState.currentSection--;
        renderCurrentSection();
        updateProgress();
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Show results screen
function showResults() {
    console.log('Showing results...');
    appState.isComplete = true;
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
    
    // Calculate final scores
    updateSectionScore();
    
    // Display total score
    const totalScoreEl = document.getElementById('total-score');
    if (totalScoreEl) {
        totalScoreEl.textContent = appState.totalScore;
    }
    
    // Find interpretation
    const interpretation = getInterpretation(appState.totalScore);
    
    // Update interpretation card
    const interpretationCard = document.getElementById('interpretation-card');
    if (interpretationCard) {
        interpretationCard.style.borderColor = interpretation.color;
        interpretationCard.style.color = interpretation.color;
    }
    
    const levelEl = document.getElementById('interpretation-level');
    const descEl = document.getElementById('interpretation-description');
    
    if (levelEl) levelEl.textContent = interpretation.level;
    if (descEl) descEl.textContent = interpretation.description;
    
    // Update results icon based on score level
    const icons = { 'Optimal': '🌟', 'Good with Improvement': '🎯', 'Moderate Concern': '⚠️', 'High Priority': '🚨' };
    const iconEl = document.getElementById('results-icon');
    if (iconEl) {
        iconEl.textContent = icons[interpretation.level] || '🎉';
    }
    
    // Render recommendations
    renderRecommendations(interpretation.recommendations);
    
    // Render section breakdown
    renderSectionBreakdown();
    
    showScreen('results-screen');
}

// Get interpretation based on score
function getInterpretation(score) {
    return assessmentData.interpretations.find(interp => 
        score >= interp.range[0] && score <= interp.range[1]
    ) || assessmentData.interpretations[0];
}

// Render recommendations
function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendations-list');
    if (container) {
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <strong>•</strong> ${rec}
            </div>
        `).join('');
    }
}

// Render section breakdown
function renderSectionBreakdown() {
    const container = document.getElementById('breakdown-grid');
    if (container) {
        container.innerHTML = assessmentData.sections.map((section, index) => `
            <div class="breakdown-item">
                <div class="breakdown-title">${section.title}</div>
                <div class="breakdown-score">${appState.sectionScores[index]} / ${section.maxScore}</div>
            </div>
        `).join('');
    }
}

// Restart assessment
function restartAssessment() {
    console.log('Restarting assessment...');
    // Reset state
    appState.currentSection = 0;
    appState.sectionScores = [0, 0, 0, 0, 0];
    appState.totalScore = 0;
    appState.isComplete = false;
    
    // Reset all scores
    Object.keys(appState.scores).forEach(key => {
        appState.scores[key] = 0;
    });
    
    // Show welcome screen
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
    showScreen('welcome-screen');
}

// Share results
function shareResults() {
    const interpretation = getInterpretation(appState.totalScore);
    const shareText = `I just completed a comprehensive gut health assessment and scored ${appState.totalScore}/116 - ${interpretation.level}! 🌟 Ready to optimize my digestive wellness.`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Gut Health Assessment Results',
            text: shareText,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Results copied to clipboard!');
        }).catch(() => {
            alert('Unable to share results. Please try again.');
        });
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-success);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Handle keyboard navigation
function handleKeyNavigation(e) {
    if (appState.isComplete) return;
    
    if (e.key === 'ArrowRight' && appState.currentSection < assessmentData.sections.length - 1) {
        nextSection();
    } else if (e.key === 'ArrowLeft' && appState.currentSection > 0) {
        previousSection();
    }
}

// Handle before unload
function handleBeforeUnload(e) {
    if (!appState.isComplete && appState.currentSection > 0) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
    }
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Make functions globally available
window.startAssessment = startAssessment;
window.nextSection = nextSection;
window.previousSection = previousSection;
window.selectScore = selectScore;
window.restartAssessment = restartAssessment;
window.shareResults = shareResults;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

console.log('JavaScript loaded successfully');