document.getElementById('dataForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading spinner
    document.querySelector('.loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    
    // Get input values
    const dataInput = document.getElementById('dataInput').value;
    const numClasses = parseInt(document.getElementById('numClasses').value);
    
    // Parse data
    const data = dataInput.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
    
    if (data.length === 0) {
        alert('Please enter valid data values');
        document.querySelector('.loading').style.display = 'none';
        return;
    }
    
    // Calculate statistics
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const classWidth = Math.ceil(range / numClasses);
    
    // Create class intervals
    const intervals = [];
    for (let i = 0; i < numClasses; i++) {
        const lower = min + (i * classWidth);
        const upper = lower + classWidth;
        intervals.push({
            lower: lower,
            upper: upper,
            frequency: 0
        });
    }
    
    // Calculate frequencies
    data.forEach(value => {
        for (let i = 0; i < intervals.length; i++) {
            if (value >= intervals[i].lower && value < intervals[i].upper) {
                intervals[i].frequency++;
                break;
            }
        }
    });
    
    // Calculate cumulative frequencies
    let cumulative = 0;
    intervals.forEach(interval => {
        cumulative += interval.frequency;
        interval.cumulative = cumulative;
    });
    
    // Calculate mean
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / data.length;
    
    // Calculate median
    const sortedData = [...data].sort((a, b) => a - b);
    const median = sortedData[Math.floor(data.length / 2)];
    
    // Calculate mode
    const frequencyMap = {};
    data.forEach(value => {
        frequencyMap[value] = (frequencyMap[value] || 0) + 1;
    });
    const mode = Object.entries(frequencyMap).reduce((a, b) => b[1] > a[1] ? b : a)[0];
    
    // Display results
    setTimeout(() => {
        // Display intervals
        const intervalsHtml = intervals.map(interval => 
            `<div class="mb-2">
                <strong>${interval.lower.toFixed(2)} - ${interval.upper.toFixed(2)}:</strong>
                Frequency: ${interval.frequency} | Cumulative: ${interval.cumulative}
            </div>`
        ).join('');
        document.getElementById('intervals').innerHTML = intervalsHtml;
        
        // Display frequency distribution
        const frequencyHtml = `
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Class Interval</th>
                        <th>Frequency</th>
                        <th>Cumulative Frequency</th>
                    </tr>
                </thead>
                <tbody>
                    ${intervals.map(interval => `
                        <tr>
                            <td>${interval.lower.toFixed(2)} - ${interval.upper.toFixed(2)}</td>
                            <td>${interval.frequency}</td>
                            <td>${interval.cumulative}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('frequency').innerHTML = frequencyHtml;
        
        // Display statistics
        const statisticsHtml = `
            <div class="row">
                <div class="col-md-4">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Mean</h6>
                            <p class="card-text">${mean.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Median</h6>
                            <p class="card-text">${median.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Mode</h6>
                            <p class="card-text">${mode}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('statistics').innerHTML = statisticsHtml;
        
        // Hide loading spinner and show results
        document.querySelector('.loading').style.display = 'none';
        document.getElementById('results').style.display = 'block';
    }, 500);
});

document.getElementById('portfolioForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get input values
    const capital = parseFloat(document.getElementById('capital').value);
    const years = parseFloat(document.getElementById('years').value);
    const interestRate = parseFloat(document.getElementById('interest').value);
    
    // Calculate portfolio value using compound interest formula
    const portfolioValue = capital * Math.pow(1 + (interestRate / 100), years);
    
    // Calculate total interest earned
    const interestEarned = portfolioValue - capital;
    
    // Calculate growth rate
    const growthRate = ((portfolioValue - capital) / capital * 100).toFixed(2);
    
    // Format the results with commas and 2 decimal places
    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };
    
    // Display the results with animations
    const resultElement = document.getElementById('result');
    const interestEarnedElement = document.getElementById('interestEarned');
    const growthRateElement = document.getElementById('growthRate');
    
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    // Animate each value
    const animateValue = (element, value, prefix = '', suffix = '') => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.textContent = `${prefix}${value}${suffix}`;
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    };
    
    // Animate each result with a slight delay
    setTimeout(() => animateValue(resultElement, formatCurrency(portfolioValue)), 100);
    setTimeout(() => animateValue(interestEarnedElement, formatCurrency(interestEarned)), 300);
    setTimeout(() => animateValue(growthRateElement, growthRate, '', '%'), 500);
    
    // Add success animation to the form
    const form = document.getElementById('portfolioForm');
    form.style.transform = 'scale(1.02)';
    setTimeout(() => {
        form.style.transition = 'transform 0.3s ease';
        form.style.transform = 'scale(1)';
    }, 200);
});

