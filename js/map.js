// Function to load the SVG into the #sdi-map element
function loadSVG() {
    fetch('../assets/sdi-map.svg') // Path to the SVG file
        .then(response => response.text())
        .then(svgContent => {
            document.getElementById('sdi-map').innerHTML = svgContent;
            loadTooltipData(); // Load the CSV data and add interaction
        })
        .catch(error => console.error('Error loading SVG:', error));
}

// Function to load the CSV file and parse it into JSON
function loadTooltipData() {
    fetch('../data/map-tooltip-data.csv') // Path to the CSV file
        .then(response => response.text())
        .then(csvContent => {
            const tooltipData = parseCSV(csvContent);
            console.log('Full tooltip data:', tooltipData); // Log the full dataset
            addTooltipInteraction(tooltipData);
        })
        .catch(error => console.error('Error loading CSV:', error));
}

// Function to parse CSV into JSON
function parseCSV(csvContent) {
    const rows = csvContent.split('\n').map(row => row.trim()).filter(row => row);
    const headers = rows[0].split(',').map(header => header.trim());
    const data = rows.slice(1).map(row => {
        const values = row.split(',').map(value => value.trim());
        return headers.reduce((obj, header, index) => {
            obj[header] = isNaN(values[index]) ? values[index] : parseFloat(values[index]);
            return obj;
        }, {});
    });
    return data;
}

// Function to add tooltip interaction
function addTooltipInteraction(tooltipData) {
    const svgElement = document.getElementById('sdi-map');

    if (!svgElement) {
        console.error('SVG element not found!');
        return;
    }

    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.background = '#fff';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.padding = '10px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.display = 'none';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '1000';
    document.body.appendChild(tooltip);

    const dots = svgElement.querySelectorAll('[id]');

    dots.forEach(dot => {
        dot.addEventListener('mouseenter', event => {
            const city = event.target.id;
            const data = tooltipData.find(item => item.City === city);

            if (data) {
                let tooltipContent = `<strong>City:</strong> ${data.City}<br>`;
                if (data["Savings groups"] !== null && data["Savings groups"] !== undefined && data["Savings groups"] !== '') {
                    tooltipContent += `<strong>Savings groups:</strong> ${data["Savings groups"]}<br>`;
                }
                if (data.Settlements !== null && data.Settlements !== undefined && data.Settlements !== '') {
                    tooltipContent += `<strong>Settlements:</strong> ${data.Settlements}`;
                }
                tooltip.innerHTML = tooltipContent;
                tooltip.style.display = 'block';
            }
        });

        dot.addEventListener('mousemove', event => {
            tooltip.style.left = event.pageX + 10 + 'px';
            tooltip.style.top = event.pageY + 10 + 'px';
        });

        dot.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });
}

// Initialize the script
document.addEventListener('DOMContentLoaded', loadSVG);
