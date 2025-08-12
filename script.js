// Global variables to track form state
let currentDiagnosis = '';
let currentSubtype = '';

// Handle process type change (reactive vs lymphoproliferative)
function handleProcessTypeChange() {
    const processType = document.getElementById('process-type').value;
    const lymphoproliferativeOptions = document.getElementById('lymphoproliferative-options');
    const bCellOptions = document.getElementById('b-cell-options');
    const hodgkinOptions = document.getElementById('hodgkin-options');
    
    // Reset all subtype options
    lymphoproliferativeOptions.style.display = 'none';
    bCellOptions.style.display = 'none';
    hodgkinOptions.style.display = 'none';
    
    if (processType === 'lymphoproliferative') {
        lymphoproliferativeOptions.style.display = 'block';
    }
}

// Handle lymphoma type change
function handleLymphomaTypeChange() {
    const lymphomaType = document.getElementById('lymphoma-type').value;
    const bCellOptions = document.getElementById('b-cell-options');
    const hodgkinOptions = document.getElementById('hodgkin-options');
    
    // Reset subtype options
    bCellOptions.style.display = 'none';
    hodgkinOptions.style.display = 'none';
    
    if (lymphomaType === 'b-cell') {
        bCellOptions.style.display = 'block';
    } else if (lymphomaType === 'hodgkin') {
        hodgkinOptions.style.display = 'block';
    }
}

// Handle B-cell subtype change
function handleBcellSubtypeChange() {
    currentSubtype = document.getElementById('b-cell-subtype').value;
    
    // Show/hide DLBCL-specific section
    const dlbclSection = document.getElementById('dlbcl-specific');
    if (currentSubtype === 'diffuse-large') {
        dlbclSection.style.display = 'block';
        // Add event listeners for auto-calculation
        addDLBCLEventListeners();
    } else {
        dlbclSection.style.display = 'none';
    }
}

// Add event listeners for DLBCL auto-calculation
function addDLBCLEventListeners() {
    // Hans criteria markers
    document.getElementById('hans-cd10').addEventListener('change', calculateHansClassification);
    document.getElementById('hans-bcl6').addEventListener('change', calculateHansClassification);
    document.getElementById('hans-mum1').addEventListener('change', calculateHansClassification);
    
    // BCL2 and MYC markers
    document.getElementById('bcl2-status').addEventListener('change', calculateCoexpression);
    document.getElementById('myc-status').addEventListener('change', calculateCoexpression);
    
    // BCL6 for triple hit calculation
    document.getElementById('hans-bcl6').addEventListener('change', calculateDoubleHit);
    document.getElementById('bcl2-status').addEventListener('change', calculateDoubleHit);
    document.getElementById('myc-status').addEventListener('change', calculateDoubleHit);
}

// Calculate Hans criteria classification (GCB vs ABC)
function calculateHansClassification() {
    const cd10 = document.getElementById('hans-cd10').value;
    const bcl6 = document.getElementById('hans-bcl6').value;
    const mum1 = document.getElementById('hans-mum1').value;
    
    let classification = '';
    
    // Hans criteria algorithm:
    // GCB: CD10+ OR (CD10- AND BCL6+ AND MUM1-)
    // NON-GCB: (CD10- AND BCL6+ AND MUM1+) OR (CD10- AND BCL6-)
    
    if (cd10 === 'positive') {
        classification = 'Germinal Center B-cell (GCB)';
    } else if (cd10 === 'negative') {
        if (bcl6 === 'positive') {
            if (mum1 === 'negative') {
                classification = 'Germinal Center B-cell (GCB)';
            } else if (mum1 === 'positive') {
                classification = 'Non-Germinal Center B-cell (Non-GCB)';
            }
        } else if (bcl6 === 'negative') {
            classification = 'Non-Germinal Center B-cell (Non-GCB)';
        }
    }
    
    // If no classification determined, mark as unclassifiable
    if (!classification) {
        classification = 'Unclassifiable';
    }
    
    document.getElementById('gcb-vs-abc').value = classification;
}

// Calculate BCL2/MYC coexpression status
function calculateCoexpression() {
    const bcl2 = document.getElementById('bcl2-status').value;
    const myc = document.getElementById('myc-status').value;
    
    let coexpression = '';
    
    if (bcl2 === 'positive' && myc === 'positive') {
        coexpression = 'Double hit (both positive)';
    } else if (bcl2 === 'positive' && myc !== 'positive') {
        coexpression = 'BCL2 positive only';
    } else if (myc === 'positive' && bcl2 !== 'positive') {
        coexpression = 'MYC positive only';
    } else {
        coexpression = 'Neither positive';
    }
    
    document.getElementById('bcl2-myc-coexpression').value = coexpression;
}

// Calculate double hit lymphoma status
function calculateDoubleHit() {
    const bcl2 = document.getElementById('bcl2-status').value;
    const myc = document.getElementById('myc-status').value;
    const bcl6 = document.getElementById('hans-bcl6').value;
    
    let doubleHitStatus = '';
    
    if (bcl2 === 'positive' && myc === 'positive' && bcl6 === 'positive') {
        doubleHitStatus = 'Triple hit (BCL2, MYC, and BCL6 positive)';
    } else if (bcl2 === 'positive' && myc === 'positive') {
        doubleHitStatus = 'Double hit (BCL2 and MYC positive)';
    } else {
        doubleHitStatus = 'No double hit features';
    }
    
    document.getElementById('double-hit-lymphoma').value = doubleHitStatus;
}

// Handle Hodgkin subtype change
function handleHodgkinSubtypeChange() {
    currentSubtype = document.getElementById('hodgkin-subtype').value;
}

// Generate the final report based on form selections
function generateReport() {
    const processType = document.getElementById('process-type').value;
    const lymphomaType = document.getElementById('lymphoma-type').value;
    
    if (!processType) {
        alert('Please select a process type first.');
        return;
    }
    
    let report = '';
    
    if (processType === 'reactive') {
        report = generateReactiveReport();
    } else if (processType === 'lymphoproliferative') {
        if (lymphomaType === 'b-cell') {
            report = generateBCellReport();
        } else if (lymphomaType === 't-cell') {
            report = generateTCellReport();
        } else if (lymphomaType === 'hodgkin') {
            report = generateHodgkinReport();
        }
    }
    
    document.getElementById('generated-report').value = report;
}

// Generate reactive lymphoid hyperplasia report
function generateReactiveReport() {
    const architecture = getSelectedText('architecture');
    const lymphNodeSize = getSelectedText('lymph-node-size');
    const follicularPattern = getSelectedText('follicular-pattern');
    const follicleSize = getSelectedText('follicle-size');
    const mantleZones = getSelectedText('mantle-zones');
    const paracortex = getSelectedText('paracortex');
    const eosinophils = getSelectedText('eosinophils');
    const plasmaCells = getSelectedText('plasma-cells');
    const necrosis = getSelectedText('necrosis');
    const granulomas = getSelectedText('granulomas');
    const capsule = getSelectedText('capsule');
    
    let report = 'RLHSYN (Reactive lymphoid hyperplasia Synoptic Report)\n\n';
    report += 'Reactive lymphoid hyperplasia. (See note.)\n\n';
    report += 'Note: The specimen is a ' + (lymphNodeSize || 'enlarged') + ' lymph node with architecture that is ' + (architecture || 'intact') + '. ';
    
    if (follicularPattern) {
        report += 'The lymph node shows ' + follicularPattern + ', with ' + (follicleSize || 'multiple follicles') + ' with active germinal centers. ';
    }
    
    if (mantleZones) {
        report += 'Mantle zones are ' + mantleZones + '. ';
    }
    
    if (paracortex) {
        report += 'The paracortex is ' + paracortex + ', and is occupied by small lymphocytes, scattered histiocytic/dendritic cells';
        
        if (eosinophils && eosinophils !== 'none') {
            report += ', ' + eosinophils + ' eosinophils';
        }
        
        if (plasmaCells && plasmaCells !== 'none') {
            report += ', ' + plasmaCells + ' plasma cells';
        }
        
        report += '. ';
    }
    
    if (granulomas && granulomas !== 'none') {
        report += 'Also present are ' + granulomas + '. ';
    }
    
    if (necrosis && necrosis !== 'none') {
        report += necrosis + ' are identified. ';
    }
    
    if (capsule) {
        report += 'The capsule is ' + capsule + '. ';
    }
    
    report += '\n\nConcurrent flow cytometry (see below) shows no clonal B-cell or atypical T-cell population.\n\n';
    report += 'In summary, the findings are consistent with reactive lymphoid hyperplasia, with no specific evidence of lymphoma or of any other neoplasm.';
    
    return report;
}

// Generate B-cell lymphoma report
function generateBCellReport() {
    const architecture = getSelectedText('architecture');
    const lymphNodeSize = getSelectedText('lymph-node-size');
    const follicularPattern = getSelectedText('follicular-pattern');
    const mantleZones = getSelectedText('mantle-zones');
    const cellSize = getSelectedText('cell-size');
    const nuclearContours = getSelectedText('nuclear-contours');
    const nucleoli = getSelectedText('nucleoli');
    const necrosis = getSelectedText('necrosis');
    const mitoticActivity = getSelectedText('mitotic-activity');
    const cd20 = getSelectedText('cd20');
    const cd3 = getSelectedText('cd3');
    const ki67 = document.getElementById('ki67').value;
    
    let report = '';
    
    if (currentSubtype === 'follicular') {
        report = 'FLSYN (Follicular lymphoma Synoptic Report)\n\n';
        report += 'Follicular lymphoma, follicular pattern, grade 1 to 2 of 3. (See note.)\n\n';
        report += 'Note: The specimen is a ' + (lymphNodeSize || 'enlarged') + ' lymph node that is almost entirely replaced by a proliferation of crowded, poorly-delineated follicles composed of centrocytes and occasional centroblasts, with fewer than 15 centroblasts per hpf in a background of centrocytes. ';
    } else if (currentSubtype === 'diffuse-large') {
        report = generateDLBCLReport();
        return report;
    }
    
    if (mantleZones) {
        report += 'Mantles are ' + mantleZones + '. ';
    }
    
    if (mitoticActivity && mitoticActivity !== 'none') {
        report += mitoticActivity + '. ';
    }
    
    if (necrosis && necrosis !== 'none') {
        report += necrosis + '. ';
    }
    
    report += '\n\nImmunostains show numerous B cells (' + (cd20 || 'CD20+') + ') in a follicular pattern. ';
    
    if (cd3) {
        report += 'Scattered non-neoplastic T cells (' + cd3 + ') are present. ';
    }
    
    if (ki67) {
        report += 'Ki67 shows a proliferation index of ' + ki67 + '. ';
    }
    
    report += '\n\nConcurrent flow cytometry (see below) demonstrates ----------\n\n';
    report += 'The histologic and immunophenotypic features together support a diagnosis of follicular lymphoma.';
    
    return report;
}

// Generate DLBCL report with Hans criteria and classification features
function generateDLBCLReport() {
    const architecture = getSelectedText('architecture');
    const lymphNodeSize = getSelectedText('lymph-node-size');
    const cellSize = getSelectedText('cell-size');
    const nuclearContours = getSelectedText('nuclear-contours');
    const nucleoli = getSelectedText('nucleoli');
    const necrosis = getSelectedText('necrosis');
    const mitoticActivity = getSelectedText('mitotic-activity');
    const cd20 = getSelectedText('cd20');
    const cd3 = getSelectedText('cd3');
    const ki67 = document.getElementById('ki67').value;
    
    // Hans criteria
    const cd10 = getSelectedText('hans-cd10');
    const bcl6 = getSelectedText('hans-bcl6');
    const mum1 = getSelectedText('hans-mum1');
    
    // EBER and classification markers
    const eberStatus = getSelectedText('eber-status');
    const bcl2Status = getSelectedText('bcl2-status');
    const mycStatus = getSelectedText('myc-status');
    const bcl2MycCoexpression = getSelectedText('bcl2-myc-coexpression');
    const mycPercentage = document.getElementById('myc-percentage').value;
    const bcl2Percentage = document.getElementById('bcl2-percentage').value;
    const gcbVsAbc = getSelectedText('gcb-vs-abc');
    const doubleHitLymphoma = getSelectedText('double-hit-lymphoma');
    
    let report = 'DLBSYN (Diffuse large B-cell lymphoma Synoptic Report)\n\n';
    report += 'Diffuse large B-cell lymphoma. (See note.)\n\n';
    report += 'Note: The specimen is a ' + (lymphNodeSize || 'enlarged') + ' lymph node that is almost entirely replaced by a diffuse infiltrate of large atypical lymphoid cells with ' + (nuclearContours || 'oval') + ' nuclei, ' + (nucleoli || 'prominent') + ' nucleoli, and scant to moderate quantity of pale cytoplasm. ';
    
    if (mitoticActivity && mitoticActivity !== 'none') {
        report += mitoticActivity + '. ';
    }
    
    if (necrosis && necrosis !== 'none') {
        report += necrosis + '. ';
    }
    
    report += '\n\nImmunostains show numerous B cells (' + (cd20 || 'CD20+') + ') in a diffuse pattern. ';
    
    // Hans criteria classification
    if (cd10 || bcl6 || mum1) {
        report += 'B cells show the following immunophenotype: ';
        if (cd10) report += 'CD10 ' + cd10 + ', ';
        if (bcl6) report += 'BCL6 ' + bcl6 + ', ';
        if (mum1) report += 'MUM1 ' + mum1 + '. ';
    }
    
    // BCL2 and MYC status
    if (bcl2Status || mycStatus) {
        report += 'BCL2 is ' + (bcl2Status || 'not performed') + ' and MYC is ' + (mycStatus || 'not performed') + '. ';
    }
    
    // BCL2/MYC coexpression
    if (bcl2MycCoexpression && bcl2MycCoexpression !== 'Neither positive') {
        report += 'BCL2/MYC coexpression analysis shows ' + bcl2MycCoexpression + '. ';
    }
    
    // Percentages if available
    if (mycPercentage || bcl2Percentage) {
        report += 'Quantitative analysis shows ';
        if (mycPercentage) report += 'MYC staining in ' + mycPercentage + ' of cells';
        if (mycPercentage && bcl2Percentage) report += ' and ';
        if (bcl2Percentage) report += 'BCL2 staining in ' + bcl2Percentage + ' of cells';
        report += '. ';
    }
    
    // GCB vs ABC classification
    if (gcbVsAbc) {
        report += 'Based on Hans criteria, this represents a ' + gcbVsAbc + ' type DLBCL. ';
    }
    
    // Double hit lymphoma status
    if (doubleHitLymphoma && doubleHitLymphoma !== 'No double hit features') {
        report += 'This represents a ' + doubleHitLymphoma + ' lymphoma. ';
    }
    
    // EBER status
    if (eberStatus && eberStatus !== 'negative') {
        report += 'In situ hybridization for Epstein-Barr virus (EBER) shows ' + eberStatus + '. ';
    }
    
    if (cd3) {
        report += 'Scattered non-neoplastic T cells (' + cd3 + ') are present. ';
    }
    
    if (ki67) {
        report += 'Ki67 shows a proliferation index of ' + ki67 + '. ';
    }
    
    report += '\n\nConcurrent flow cytometry (see below) demonstrates ----------\n\n';
    
    // Final classification statement
    let finalClassification = 'The histologic and immunophenotypic features together support a diagnosis of diffuse large B-cell lymphoma';
    
    if (gcbVsAbc && gcbVsAbc.includes('Germinal Center B-cell')) {
        finalClassification += ' of germinal center B-cell origin';
    } else if (gcbVsAbc && gcbVsAbc.includes('Non-Germinal Center B-cell')) {
        finalClassification += ' of non-germinal center B-cell origin';
    } else if (gcbVsAbc && gcbVsAbc.includes('Unclassifiable')) {
        finalClassification += ' (unclassifiable by Hans criteria)';
    }
    
    if (doubleHitLymphoma && doubleHitLymphoma.includes('Double hit')) {
        finalClassification += ' with double hit features (BCL2 and MYC positive)';
    } else if (doubleHitLymphoma && doubleHitLymphoma.includes('Triple hit')) {
        finalClassification += ' with triple hit features (BCL2, MYC, and BCL6 positive)';
    }
    
    finalClassification += '.';
    
    report += finalClassification;
    
    return report;
}

// Generate T-cell lymphoma report
function generateTCellReport() {
    const architecture = getSelectedText('architecture');
    const lymphNodeSize = getSelectedText('lymph-node-size');
    const cellSize = getSelectedText('cell-size');
    const nuclearContours = getSelectedText('nuclear-contours');
    const chromatinQuality = getSelectedText('chromatin-quality');
    const nucleoli = getSelectedText('nucleoli');
    const cd3 = getSelectedText('cd3');
    const cd20 = getSelectedText('cd20');
    const ki67 = document.getElementById('ki67').value;
    
    let report = 'T-Cell Lymphoma Report\n\n';
    report += 'T-cell lymphoma. (See note.)\n\n';
    report += 'Note: The specimen is a ' + (lymphNodeSize || 'enlarged') + ' lymph node with ' + (architecture || 'architectural effacement') + ' by a diffuse infiltrate of ' + (cellSize || 'atypical') + ' T cells with ' + (nuclearContours || 'irregular') + ' nuclei, ' + (chromatinQuality || 'coarse') + ' chromatin, and ' + (nucleoli || 'inconspicuous') + ' nucleoli. ';
    
    report += '\n\nImmunostains show numerous T cells (' + (cd3 || 'CD3+') + ') in a diffuse pattern. ';
    
    if (cd20) {
        report += 'B cells (' + cd20 + ') are present. ';
    }
    
    if (ki67) {
        report += 'Ki67 shows a proliferation index of ' + ki67 + '. ';
    }
    
    report += '\n\nConcurrent flow cytometry (see below) demonstrates ----------\n\n';
    report += 'The histologic and immunophenotypic features together support a diagnosis of T-cell lymphoma.';
    
    return report;
}

// Generate Hodgkin lymphoma report
function generateHodgkinReport() {
    const architecture = getSelectedText('architecture');
    const lymphNodeSize = getSelectedText('lymph-node-size');
    const cellSize = getSelectedText('cell-size');
    const nuclearContours = getSelectedText('nuclear-contours');
    const nucleoli = getSelectedText('nucleoli');
    const cd30 = getSelectedText('cd30');
    const cd15 = getSelectedText('cd15');
    const cd20 = getSelectedText('cd20');
    const cd3 = getSelectedText('cd3');
    
    let report = '';
    
    if (currentSubtype === 'classical') {
        report = 'CHLSYN (Classical Hodgkin lymphoma Synoptic Report)\n\n';
        report += 'Classic Hodgkin lymphoma, mixed cellularity sub-type. (See note.)\n\n';
        report += 'Note: The specimen is a ' + (lymphNodeSize || 'markedly enlarged') + ' lymph node with ' + (architecture || 'architectural effacement') + ' by a mixed inflammatory cell infiltrate consisting of small lymphocytes, histiocytes, granulocytes including eosinophils, plasma cells and large atypical cells. ';
    } else if (currentSubtype === 'nodular-lp') {
        report = 'NLPSYN (Nodular lymphocyte predominant Hodgkin lymphoma Synoptic Report)\n\n';
        report += 'Nodular lymphocyte predominant Hodgkin lymphoma. (See note.)\n\n';
        report += 'Note: The specimen is a ' + (lymphNodeSize || 'markedly enlarged') + ' lymph node that is almost entirely replaced by large, crowded, expansile nodules of cells. ';
    }
    
    report += 'The latter have large ' + (nuclearContours || 'oval') + ' nuclei, ' + (nucleoli || 'prominent') + ' nucleoli, and scant to moderate quantity of pale cytoplasm. ';
    
    if (currentSubtype === 'classical') {
        report += 'The appearance of the large cells is consistent with Reed-Sternberg cells and variants. ';
    } else {
        report += 'The appearance of the large cells is consistent with lymphocyte predominant (LP) cells. ';
    }
    
    report += '\n\nImmunostains show that the large atypical cells are positive for ' + (cd30 || 'CD30') + ', ' + (cd15 || 'CD15') + '. ';
    
    if (cd20) {
        report += 'Large cells are ' + cd20 + ' for CD20. ';
    }
    
    if (cd3) {
        report += 'The small lymphocytes are a mixture of T cells (' + cd3 + ') and fewer small B cells. ';
    }
    
    report += '\n\nConcurrent flow cytometry (see below) shows no abnormal B or T-cell population.\n\n';
    report += 'The histologic and immunophenotypic findings together support a diagnosis of ' + (currentSubtype === 'classical' ? 'classic Hodgkin lymphoma' : 'nodular lymphocyte predominant Hodgkin lymphoma') + '.';
    
    return report;
}

// Helper function to get the text of selected option
function getSelectedText(selectId) {
    const select = document.getElementById(selectId);
    if (select && select.selectedIndex > 0) {
        return select.options[select.selectedIndex].text;
    }
    return '';
}

// Clear all form fields
function clearForm() {
    const selects = document.querySelectorAll('select');
    const inputs = document.querySelectorAll('input[type="text"]');
    
    selects.forEach(select => {
        select.selectedIndex = 0;
    });
    
    inputs.forEach(input => {
        input.value = '';
    });
    
    // Hide all conditional options
    document.getElementById('lymphoproliferative-options').style.display = 'none';
    document.getElementById('b-cell-options').style.display = 'none';
    document.getElementById('hodgkin-options').style.display = 'none';
    document.getElementById('dlbcl-specific').style.display = 'none';
    
    // Clear the report
    document.getElementById('generated-report').value = '';
    
    // Reset global variables
    currentDiagnosis = '';
    currentSubtype = '';
    
    // Clear calculated fields
    document.getElementById('gcb-vs-abc').value = '';
    document.getElementById('bcl2-myc-coexpression').value = '';
    document.getElementById('double-hit-lymphoma').value = '';
}

// Copy the generated report to clipboard
function copyReport() {
    const reportText = document.getElementById('generated-report').value;
    if (!reportText) {
        alert('No report to copy. Please generate a report first.');
        return;
    }
    
    navigator.clipboard.writeText(reportText).then(() => {
        alert('Report copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = reportText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Report copied to clipboard!');
    });
}

// Download the generated report as a text file
function downloadReport() {
    const reportText = document.getElementById('generated-report').value;
    if (!reportText) {
        alert('No report to download. Please generate a report first.');
        return;
    }
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lymphoid_biopsy_report.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add any initialization code here if needed
    console.log('Lymphoid Tissue Biopsy Reporter initialized');
});
