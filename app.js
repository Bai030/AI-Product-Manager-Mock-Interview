// AI产品经理模拟面试系统主逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 状态管理
    const state = {
        currentQuestionIndex: 0,
        answers: new Array(interviewData.questions.length).fill(''),
        scores: new Array(interviewData.questions.length).fill(null),
        feedbacks: new Array(interviewData.questions.length).fill(null),
        isCompleted: false
    };
    
    // DOM元素
    const elements = {
        progressText: document.getElementById('progress-text'),
        progressFill: document.getElementById('progress-fill'),
        questionTitle: document.getElementById('question-title'),
        questionText: document.getElementById('question-text'),
        dimensionTag: document.getElementById('dimension-tag'),
        examPointsList: document.getElementById('exam-points-list'),
        answerInput: document.getElementById('answer-input'),
        wordCount: document.getElementById('word-count'),
        
        // 反馈区域
        feedbackSection: document.getElementById('feedback-section'),
        scoreValue: document.getElementById('score-value'),
        scoreLevel: document.getElementById('score-level'),
        keyPoints: document.getElementById('key-points'),
        strengthsList: document.getElementById('strengths-list'),
        weaknessesList: document.getElementById('weaknesses-list'),
        suggestionsList: document.getElementById('suggestions-list'),
        
        // 总结报告区域
        summarySection: document.getElementById('summary-section'),
        totalScore: document.getElementById('total-score'),
        overallLevel: document.getElementById('overall-level'),
        improvementList: document.getElementById('improvement-list'),
        actionList: document.getElementById('action-list'),
        
        // 按钮
        prevBtn: document.getElementById('prev-btn'),
        submitBtn: document.getElementById('submit-btn'),
        nextBtn: document.getElementById('next-btn'),
        showSummaryBtn: document.getElementById('show-summary-btn'),
        restartBtn: document.getElementById('restart-btn')
    };
    
    // 初始化
    function init() {
        // 加载第一个问题
        loadQuestion(state.currentQuestionIndex);
        
        // 绑定事件
        bindEvents();
        
        // 初始化字数统计
        updateWordCount();
    }
    
    // 绑定事件
    function bindEvents() {
        // 输入框事件
        elements.answerInput.addEventListener('input', function() {
            state.answers[state.currentQuestionIndex] = this.value;
            updateWordCount();
        });
        
        // 按钮事件
        elements.prevBtn.addEventListener('click', goToPreviousQuestion);
        elements.submitBtn.addEventListener('click', submitAnswer);
        elements.nextBtn.addEventListener('click', goToNextQuestion);
        elements.showSummaryBtn.addEventListener('click', showSummary);
        elements.restartBtn.addEventListener('click', restartInterview);
    }
    
    // 加载问题
    function loadQuestion(index) {
        const question = interviewData.questions[index];
        
        // 更新问题信息
        elements.questionTitle.textContent = question.title;
        elements.questionText.textContent = question.text;
        elements.dimensionTag.textContent = question.dimension;
        elements.dimensionTag.style.background = getDimensionColor(question.dimension);
        
        // 更新考察要点
        elements.examPointsList.innerHTML = '';
        question.examPoints.forEach(point => {
            const li = document.createElement('li');
            li.textContent = point;
            elements.examPointsList.appendChild(li);
        });
        
        // 更新答案输入框
        elements.answerInput.value = state.answers[index] || '';
        
        // 更新进度
        updateProgress(index);
        
        // 更新按钮状态
        updateButtonStates();
        
        // 隐藏反馈区域
        hideFeedback();
        
        // 更新提交按钮文本
        updateSubmitButtonText();
    }
    
    // 更新进度
    function updateProgress(index) {
        const totalQuestions = interviewData.questions.length;
        const progressPercentage = ((index + 1) / totalQuestions) * 100;
        
        elements.progressText.textContent = `问题 ${index + 1}/${totalQuestions}`;
        elements.progressFill.style.width = `${progressPercentage}%`;
    }
    
    // 更新按钮状态
    function updateButtonStates() {
        // 上一题按钮
        elements.prevBtn.disabled = state.currentQuestionIndex === 0;
        
        // 提交按钮
        const hasAnswer = state.answers[state.currentQuestionIndex].trim().length > 0;
        elements.submitBtn.disabled = !hasAnswer;
        
        // 下一题按钮
        const isLastQuestion = state.currentQuestionIndex === interviewData.questions.length - 1;
        const hasScore = state.scores[state.currentQuestionIndex] !== null;
        
        if (hasScore && !isLastQuestion) {
            elements.nextBtn.classList.remove('hidden');
        } else {
            elements.nextBtn.classList.add('hidden');
        }
        
        // 查看总结报告按钮
        if (state.isCompleted) {
            elements.showSummaryBtn.classList.remove('hidden');
        } else {
            elements.showSummaryBtn.classList.add('hidden');
        }
    }
    
    // 更新提交按钮文本
    function updateSubmitButtonText() {
        const hasScore = state.scores[state.currentQuestionIndex] !== null;
        elements.submitBtn.innerHTML = hasScore ? 
            '<i class="fas fa-sync-alt"></i> 重新评分' : 
            '<i class="fas fa-paper-plane"></i> 提交评分';
    }
    
    // 更新字数统计
    function updateWordCount() {
        const text = elements.answerInput.value;
        const wordCount = text.trim().length;
        elements.wordCount.textContent = wordCount;
    }
    
    // 获取维度颜色
    function getDimensionColor(dimension) {
        const colorMap = {
            '岗位理解': '#4361ee',
            '产品设计': '#7209b7',
            '数据分析': '#4cc9f0',
            '技术理解': '#f8961e',
            '商业思维': '#38b000',
            '应变能力': '#f72585',
            '项目经验': '#9d4edd',
            '行业认知': '#00bbf9',
            '伦理安全': '#ff0054',
            '职业规划': '#6a00f4'
        };
        return colorMap[dimension] || '#4361ee';
    }
    
    // 提交答案
    function submitAnswer() {
        const answer = state.answers[state.currentQuestionIndex];
        if (!answer.trim()) {
            alert('请先输入你的回答');
            return;
        }
        
        // 模拟评分（实际应用中应由AI或专家评分）
        const score = simulateScore(answer);
        const question = interviewData.questions[state.currentQuestionIndex];
        
        // 保存评分和反馈
        state.scores[state.currentQuestionIndex] = score;
        state.feedbacks[state.currentQuestionIndex] = interviewData.generateFeedback(score, question);
        
        // 显示反馈
        showFeedback(score, question);
        
        // 更新按钮状态
        updateButtonStates();
        
        // 如果是最后一题且已评分，显示总结报告按钮
        const isLastQuestion = state.currentQuestionIndex === interviewData.questions.length - 1;
        if (isLastQuestion && score !== null) {
            state.isCompleted = true;
            elements.showSummaryBtn.classList.remove('hidden');
        }
    }
    
    // 模拟评分（简化版）
    function simulateScore(answer) {
        // 基于回答长度、关键词等因素模拟评分
        const length = answer.trim().length;
        let score = 0;
        
        // 长度得分
        if (length < 50) score = 1;
        else if (length < 100) score = 2;
        else if (length < 200) score = 3;
        else if (length < 300) score = 4;
        else score = 5;
        
        // 添加随机波动（±0.5）
        score += (Math.random() - 0.5);
        
        // 确保在0-5范围内
        score = Math.max(0, Math.min(5, score));
        
        // 四舍五入到一位小数
        return Math.round(score * 10) / 10;
    }
    
    // 显示反馈
    function showFeedback(score, question) {
        const feedback = state.feedbacks[state.currentQuestionIndex];
        
        // 更新评分显示
        elements.scoreValue.textContent = score.toFixed(1);
        elements.scoreLevel.textContent = getScoreLevel(score);
        elements.keyPoints.textContent = question.keyPoints.join('、');
        
        // 更新优点
        elements.strengthsList.innerHTML = '';
        feedback.strengths.forEach(strength => {
            const li = document.createElement('li');
            li.textContent = strength;
            elements.strengthsList.appendChild(li);
        });
        
        // 更新不足
        elements.weaknessesList.innerHTML = '';
        feedback.weaknesses.forEach(weakness => {
            const li = document.createElement('li');
            li.textContent = weakness;
            elements.weaknessesList.appendChild(li);
        });
        
        // 更新建议
        elements.suggestionsList.innerHTML = '';
        feedback.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            elements.suggestionsList.appendChild(li);
        });
        
        // 显示反馈区域
        elements.feedbackSection.classList.remove('hidden');
        
        // 滚动到反馈区域
        elements.feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // 获取评分等级
    function getScoreLevel(score) {
        if (score >= 4.5) return '非常出色';
        if (score >= 3.5) return '良好';
        if (score >= 2.5) return '合格';
        if (score >= 1.5) return '需要提升';
        return '需要重点加强';
    }
    
    // 隐藏反馈
    function hideFeedback() {
        elements.feedbackSection.classList.add('hidden');
    }
    
    // 前往上一题
    function goToPreviousQuestion() {
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            loadQuestion(state.currentQuestionIndex);
        }
    }
    
    // 前往下一题
    function goToNextQuestion() {
        if (state.currentQuestionIndex < interviewData.questions.length - 1) {
            state.currentQuestionIndex++;
            loadQuestion(state.currentQuestionIndex);
        }
    }
    
    // 显示总结报告
    function showSummary() {
        // 计算总分和维度得分
        const total = calculateTotalScore();
        const dimensionScores = calculateDimensionScores();
        
        // 更新总结报告
        updateSummaryReport(total, dimensionScores);
        
        // 显示总结报告区域
        elements.summarySection.classList.remove('hidden');
        
        // 隐藏其他区域（可选）
        // elements.feedbackSection.classList.add('hidden');
        
        // 滚动到总结报告
        elements.summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // 渲染雷达图
        renderRadarChart(dimensionScores);
    }
    
    // 计算总分
    function calculateTotalScore() {
        const validScores = state.scores.filter(score => score !== null);
        if (validScores.length === 0) return 0;
        
        const sum = validScores.reduce((acc, score) => acc + score, 0);
        return Math.round(sum * 10) / 10; // 保留一位小数
    }
    
    // 计算维度得分
    function calculateDimensionScores() {
        const dimensionScores = {};
        
        // 初始化维度
        interviewData.dimensions.forEach(dim => {
            dimensionScores[dim.name] = {
                total: 0,
                count: 0,
                average: 0
            };
        });
        
        // 累加各维度得分
        interviewData.questions.forEach((question, index) => {
            const score = state.scores[index];
            if (score !== null) {
                const dimension = question.dimension;
                dimensionScores[dimension].total += score;
                dimensionScores[dimension].count++;
            }
        });
        
        // 计算平均值
        for (const [dimension, data] of Object.entries(dimensionScores)) {
            if (data.count > 0) {
                data.average = Math.round((data.total / data.count) * 100) / 100;
            }
        }
        
        return dimensionScores;
    }
    
    // 更新总结报告
    function updateSummaryReport(total, dimensionScores) {
        // 更新总分
        elements.totalScore.textContent = total;
        
        // 更新总体等级
        const overallLevel = getOverallLevel(total);
        elements.overallLevel.textContent = overallLevel.name;
        elements.overallLevel.style.color = getLevelColor(overallLevel.name);
        
        // 更新重点提升领域
        updateImprovementAreas(dimensionScores);
        
        // 更新行动计划
        updateActionPlan(total);
    }
    
    // 获取总体等级
    function getOverallLevel(totalScore) {
        const maxScore = interviewData.questions.length * 5;
        const percentage = (totalScore / maxScore) * 100;
        
        if (percentage >= 90) return { name: '优秀', color: '#38b000' };
        if (percentage >= 70) return { name: '良好', color: '#4cc9f0' };
        if (percentage >= 50) return { name: '合格', color: '#f8961e' };
        if (percentage >= 30) return { name: '待提升', color: '#ff9500' };
        return { name: '薄弱', color: '#f94144' };
    }
    
    // 获取等级颜色
    function getLevelColor(level) {
        const colorMap = {
            '优秀': '#38b000',
            '良好': '#4cc9f0',
            '合格': '#f8961e',
            '待提升': '#ff9500',
            '薄弱': '#f94144'
        };
        return colorMap[level] || '#4361ee';
    }
    
    // 更新重点提升领域
    function updateImprovementAreas(dimensionScores) {
        elements.improvementList.innerHTML = '';
        
        // 找出得分较低的维度（平均分低于3）
        const weakDimensions = [];
        for (const [dimension, data] of Object.entries(dimensionScores)) {
            if (data.average < 3 && data.count > 0) {
                weakDimensions.push({
                    name: dimension,
                    score: data.average
                });
            }
        }
        
        // 如果所有维度都较好，显示鼓励信息
        if (weakDimensions.length === 0) {
            const li = document.createElement('li');
            li.textContent = '各维度表现均衡，继续保持系统学习和实践';
            elements.improvementList.appendChild(li);
            return;
        }
        
        // 按得分排序，取最需要提升的3个维度
        weakDimensions.sort((a, b) => a.score - b.score);
        const topWeak = weakDimensions.slice(0, 3);
        
        topWeak.forEach(dim => {
            const li = document.createElement('li');
            li.textContent = `${dim.name}（当前得分: ${dim.score.toFixed(1)}/5）`;
            elements.improvementList.appendChild(li);
        });
    }
    
    // 更新行动计划
    function updateActionPlan(totalScore) {
        elements.actionList.innerHTML = '';
        
        const actions = [];
        
        // 根据总分推荐行动
        if (totalScore >= 40) {
            actions.push('深化行业研究，建立垂直领域专家形象');
            actions.push('参与开源AI项目，积累技术影响力');
            actions.push('准备高阶面试问题（如系统架构、商业战略）');
        } else if (totalScore >= 30) {
            actions.push('系统学习AI产品经理知识体系');
            actions.push('加强技术理解，跟踪大模型最新进展');
            actions.push('练习结构化表达，使用STAR法则回答问题');
        } else if (totalScore >= 20) {
            actions.push('从基础开始学习机器学习、深度学习概念');
            actions.push('分析优秀AI产品案例，总结设计模式');
            actions.push('参与模拟面试，提升实战能力');
        } else {
            actions.push('学习产品经理基础知识');
            actions.push('了解AI技术发展趋势');
            actions.push('参加AI产品经理入门课程');
        }
        
        // 通用行动
        actions.push('定期复盘面试表现，持续改进');
        actions.push('关注行业动态，保持技术敏感度');
        actions.push('建立个人作品集，展示项目能力');
        
        // 添加到列表
        actions.forEach(action => {
            const li = document.createElement('li');
            li.textContent = action;
            elements.actionList.appendChild(li);
        });
    }
    
    // 渲染雷达图
    function renderRadarChart(dimensionScores) {
        const ctx = document.getElementById('radar-chart').getContext('2d');
        
        // 准备数据
        const labels = [];
        const data = [];
        
        for (const [dimension, scores] of Object.entries(dimensionScores)) {
            labels.push(dimension);
            data.push(scores.average || 0);
        }
        
        // 如果之前有图表实例，先销毁
        if (window.radarChartInstance) {
            window.radarChartInstance.destroy();
        }
        
        // 创建雷达图
        window.radarChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: '能力维度得分',
                    data: data,
                    backgroundColor: 'rgba(67, 97, 238, 0.2)',
                    borderColor: 'rgba(67, 97, 238, 1)',
                    pointBackgroundColor: 'rgba(67, 97, 238, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(67, 97, 238, 1)',
                    borderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return value + '分';
                            }
                        },
                        pointLabels: {
                            font: {
                                size: 12,
                                family: 'Inter'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw.toFixed(1) + '分';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // 重新开始
    function restartInterview() {
        if (confirm('确定要重新开始模拟面试吗？当前进度将会丢失。')) {
            // 重置状态
            state.currentQuestionIndex = 0;
            state.answers.fill('');
            state.scores.fill(null);
            state.feedbacks.fill(null);
            state.isCompleted = false;
            
            // 重新加载第一个问题
            loadQuestion(state.currentQuestionIndex);
            
            // 隐藏总结报告
            elements.summarySection.classList.add('hidden');
            
            // 重置雷达图
            if (window.radarChartInstance) {
                window.radarChartInstance.destroy();
                window.radarChartInstance = null;
            }
        }
    }
    
    // 启动应用
    init();
});