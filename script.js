 class PositivityAnalyzer {
    constructor() {
        this.positiveWords = [
            'achieve', 'success', 'grow', 'improve', 'excel', 'thrive', 'flourish', 'prosper',
            'accomplish', 'master', 'overcome', 'conquer', 'triumph', 'victory', 'win',
            'create', 'build', 'develop', 'enhance', 'optimize', 'maximize', 'boost',
            'amazing', 'fantastic', 'excellent', 'outstanding', 'remarkable', 'incredible',
            'inspiring', 'motivating', 'empowering', 'uplifting', 'energizing', 'exciting',
            'passionate', 'determined', 'confident', 'focused', 'committed', 'dedicated',
            'love', 'enjoy', 'appreciate', 'grateful', 'thankful', 'blessed', 'fortunate',
            'positive', 'optimistic', 'hopeful', 'bright', 'brilliant', 'wonderful',
            'transform', 'revolutionize', 'innovate', 'pioneer', 'breakthrough', 'advance'
        ];
        
        this.negativeWords = [
            'fail', 'failure', 'impossible', 'never', 'can\'t', 'won\'t', 'shouldn\'t',
            'difficult', 'hard', 'struggle', 'problem', 'issue', 'challenge', 'obstacle',
            'worry', 'fear', 'anxiety', 'stress', 'pressure', 'burden', 'overwhelm',
            'tired', 'exhausted', 'burnt', 'frustrated', 'annoyed', 'angry', 'upset',
            'boring', 'dull', 'mundane', 'tedious', 'pointless', 'useless', 'worthless',
            'hate', 'dislike', 'avoid', 'prevent', 'stop', 'quit', 'give up',
            'terrible', 'awful', 'horrible', 'bad', 'worst', 'disappointing'
        ];

        this.neutralWords = [
            'need', 'want', 'should', 'could', 'would', 'might', 'maybe', 'perhaps',
            'try', 'attempt', 'consider', 'think', 'plan', 'intend', 'hope',
            'work', 'do', 'make', 'get', 'take', 'go', 'come', 'see'
        ];

        this.goals = JSON.parse(localStorage.getItem('positivityGoals') || '[]');
        this.initializeElements();
        this.attachEventListeners();
        this.renderGoals();
        this.updateStats();
        this.createFloatingParticles();
        this.setupButtonEffects();
    }

    initializeElements() {
        this.goalInput = document.getElementById('goalInput');
        this.addGoalBtn = document.getElementById('addGoal');
        this.positivityScore = document.getElementById('positivityScore');
        this.positivityLabel = document.getElementById('positivityLabel');
        this.currentFeedback = document.getElementById('currentFeedback');
        this.totalGoals = document.getElementById('totalGoals');
        this.positiveGoals = document.getElementById('positiveGoals');
        this.avgScore = document.getElementById('avgScore');
        this.goalsList = document.getElementById('goalsList');
        this.feedbackTitle = document.getElementById('feedbackTitle');
        this.feedbackMessage = document.getElementById('feedbackMessage');
    }

    attachEventListeners() {
        this.goalInput.addEventListener('input', () => this.analyzeCurrentInput());
        this.addGoalBtn.addEventListener('click', () => this.addGoal());
        this.goalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.addGoal();
            }
        });
    }

    analyzeText(text) {
        if (!text.trim()) return { score: 50, sentiment: 'neutral' };

        const words = text.toLowerCase().split(/\s+/);
        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;

        words.forEach(word => {
            const cleanWord = word.replace(/[^\w]/g, '');
            if (this.positiveWords.includes(cleanWord)) {
                positiveCount++;
            } else if (this.negativeWords.includes(cleanWord)) {
                negativeCount++;
            } else if (this.neutralWords.includes(cleanWord)) {
                neutralCount++;
            }
        });

        // Calculate score with additional factors
        let score = 50; // Base neutral score
        
        // Word-based scoring
        score += (positiveCount * 15) - (negativeCount * 10) + (neutralCount * 2);
        
        // Length bonus for detailed goals
        if (words.length > 10) score += 5;
        if (words.length > 20) score += 5;
        
        // Exclamation points add enthusiasm
        score += (text.match(/!/g) || []).length * 3;
        
        // Future tense is positive
        if (text.match(/\b(will|going to|plan to|aim to)\b/gi)) score += 8;
        
        // First person commitment
        if (text.match(/\b(I will|I am|I'm going)\b/gi)) score += 10;

        // Ensure score is within bounds
        score = Math.max(0, Math.min(100, score));

        let sentiment = 'neutral';
        if (score >= 70) sentiment = 'positive';
        else if (score <= 30) sentiment = 'negative';

        return { score: Math.round(score), sentiment };
    }

    analyzeCurrentInput() {
        const text = this.goalInput.value;
        const analysis = this.analyzeText(text);
        
        this.updatePositivityMeter(analysis.score, analysis.sentiment);
        this.updateLiveFeedback(analysis);
    }

    updatePositivityMeter(score, sentiment) {
        this.positivityScore.textContent = score;
        this.positivityScore.style.color = this.getScoreColor(score);
        
        const labels = {
            positive: 'Inspiring! 🌟',
            neutral: 'Getting There 🎯',
            negative: 'Needs Boost 💪'
        };
        
        this.positivityLabel.textContent = labels[sentiment];
        this.positivityLabel.style.color = this.getScoreColor(score);
    }

    updateLiveFeedback(analysis) {
        const feedbacks = {
            positive: [
                "Fantastic energy! Your goal radiates positivity! ✨",
                "Incredible motivation! This goal will inspire action! 🚀",
                "Amazing mindset! You're setting yourself up for success! 🌟",
                "Brilliant! This positive framing will fuel your achievement! 💫"
            ],
            neutral: [
                "Good start! Try adding more inspiring language. 💪",
                "Nice foundation! Consider what excites you about this goal. 🎯",
                "Getting there! What positive outcomes do you envision? 🌱",
                "Solid goal! How can you make it more energizing? ⚡"
            ],
            negative: [
                "Let's reframe this with positive language! Focus on what you WILL achieve. 🔄",
                "Transform 'can't' into 'will learn how to'! 💡",
                "Shift from obstacles to opportunities! What's possible? 🌈",
                "Flip the script! How can you state this as an exciting challenge? 🎪"
            ]
        };

        const messages = feedbacks[analysis.sentiment];
        this.currentFeedback.textContent = messages[Math.floor(Math.random() * messages.length)];
    }

    getScoreColor(score) {
        if (score >= 70) return '#10b981';
        if (score >= 40) return '#f59e0b';
        return '#ef4444';
    }

    addGoal() {
        const text = this.goalInput.value.trim();
        if (!text) return;

        const analysis = this.analyzeText(text);
        const goal = {
            id: Date.now(),
            text: text,
            score: analysis.score,
            sentiment: analysis.sentiment,
            timestamp: new Date().toISOString()
        };

        this.goals.unshift(goal);
        this.saveGoals();
        this.goalInput.value = '';
        this.renderGoals();
        this.updateStats();
        this.updateGlobalFeedback();
        this.resetMeter();
    }

    deleteGoal(id) {
        this.goals = this.goals.filter(goal => goal.id !== id);
        this.saveGoals();
        this.renderGoals();
        this.updateStats();
        this.updateGlobalFeedback();
    }

    saveGoals() {
        localStorage.setItem('positivityGoals', JSON.stringify(this.goals));
    }

    renderGoals() {
        this.goalsList.innerHTML = this.goals.map(goal => `
            <div class="goal-item ${goal.sentiment}" style="animation-delay: ${Math.random() * 0.5}s">
                <div class="goal-text">${goal.text}</div>
                <div class="goal-meta">
                    <span>${new Date(goal.timestamp).toLocaleDateString()}</span>
                    <div>
                        <span class="positivity-badge badge-${goal.sentiment}">
                            ${goal.sentiment} ${goal.score}
                        </span>
                        <button class="delete-btn" onclick="dashboard.deleteGoal(${goal.id})">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const total = this.goals.length;
        const positive = this.goals.filter(g => g.sentiment === 'positive').length;
        const avgScore = total > 0 ? Math.round(this.goals.reduce((sum, g) => sum + g.score, 0) / total) : 0;

        this.totalGoals.textContent = total;
        this.positiveGoals.textContent = positive;
        this.avgScore.textContent = avgScore;

        // Animate the numbers
        this.animateNumber(this.totalGoals);
        this.animateNumber(this.positiveGoals);
        this.animateNumber(this.avgScore);
    }

    animateNumber(element) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#667eea';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '#667eea';
        }, 300);
    }

    updateGlobalFeedback() {
        const total = this.goals.length;
        if (total === 0) return;

        const positiveRatio = this.goals.filter(g => g.sentiment === 'positive').length / total;
        const avgScore = this.goals.reduce((sum, g) => sum + g.score, 0) / total;

        let title, message;

        if (positiveRatio >= 0.8 && avgScore >= 75) {
            title = "🏆 Positivity Champion!";
            message = "Incredible! Your goals radiate pure positive energy. This mindset will carry you to amazing achievements!";
        } else if (positiveRatio >= 0.6 && avgScore >= 60) {
            title = "🌟 Great Progress!";
            message = "Fantastic work! Your positive goal-setting is building momentum. Keep this energy flowing!";
        } else if (positiveRatio >= 0.4) {
            title = "💪 Building Momentum!";
            message = "You're developing a more positive approach! Focus on what excites you about your goals.";
        } else {
            title = "🌱 Growing Stronger!";
            message = "Every goal is a step forward! Try reframing challenges as exciting opportunities to grow.";
        }

        this.feedbackTitle.textContent = title;
        this.feedbackMessage.textContent = message;
    }

    resetMeter() {
        this.positivityScore.textContent = '0';
        this.positivityLabel.textContent = 'Ready';
        this.currentFeedback.textContent = "Goal added! Write another one to keep the momentum going! 🚀";
        this.positivityScore.style.color = '#64748b';
        this.positivityLabel.style.color = '#64748b';
    }

    createFloatingParticles() {
        const particleContainer = document.querySelector('.floating-particles');
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            particleContainer.appendChild(particle);
        }
    }

    setupButtonEffects() {
        const addGoalBtn = document.getElementById('addGoal');
        
        addGoalBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
        });

        addGoalBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    }
}

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new PositivityAnalyzer();
});

// Export for use in HTML onclick handlers
window.PositivityAnalyzer = PositivityAnalyzer;