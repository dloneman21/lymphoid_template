# Lymphoid Tissue Biopsy Reporter

A HIPAA-compliant web application for generating structured pathology reports for lymphoid tissue biopsies. This application runs entirely in the browser with no server-side components or data transfer, ensuring complete privacy and compliance.

## Features

- **Hierarchical Diagnostic Classification**: Start with process type (reactive vs. lymphoproliferative) and drill down to specific lymphoma subtypes
- **Comprehensive Tissue Characterization**: Capture architecture, cellular composition, atypical cell features, and other notable findings
- **Immunohistochemistry Integration**: Include staining results for key markers (CD20, CD3, CD30, CD15, Ki67)
- **Template-Based Report Generation**: Generate structured reports following standard synoptic report formats
- **Export Options**: Copy to clipboard or download as text file
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Print-Friendly**: Optimized for printing reports

## Supported Diagnoses

### Reactive Processes
- Reactive lymphoid hyperplasia

### B-Cell Lymphomas
- Follicular lymphoma
- Diffuse large B-cell lymphoma (with Hans criteria, EBER status, BCL2/MYC coexpression analysis)
- Marginal zone lymphoma
- Mantle cell lymphoma

### T-Cell Lymphomas
- Various T-cell lymphoma subtypes

### Hodgkin Lymphomas
- Classical Hodgkin lymphoma
- Nodular lymphocyte predominant Hodgkin lymphoma

## Usage Instructions

### 1. Diagnostic Classification
- Select the primary process type (reactive or lymphoproliferative)
- If lymphoproliferative, choose the lymphoma type (B-cell, T-cell, or Hodgkin)
- For B-cell and Hodgkin lymphomas, select the specific subtype

### 2. Tissue Characteristics
Fill in the relevant sections based on your findings:

- **Architecture & Cellular Features**: Lymph node size, architecture, follicular patterns
- **Cellular Composition**: Mantle zones, paracortex, eosinophils, plasma cells
- **Atypical Cells**: Size, nuclear contours, chromatin quality, nucleoli
- **Other Features**: Necrosis, mitotic activity, granulomas, capsule status
- **Immunohistochemistry**: CD markers and Ki67 proliferation index
- **DLBCL Classification**: Hans criteria (CD10, BCL6, MUM1), EBER status, BCL2/MYC coexpression, GCB vs ABC classification, double/triple hit lymphoma features

### 3. Report Generation
- Click "Generate Report" to create the structured report
- Review the generated text in the report area
- Use "Copy Report" to copy to clipboard
- Use "Download Report" to save as a text file
- Use "Clear Form" to reset all selections

## Technical Details

- **Frontend Only**: Pure HTML, CSS, and JavaScript
- **No Dependencies**: No external libraries or frameworks required
- **Local Processing**: All data processing occurs in the browser
- **HIPAA Compliant**: No data transmission to external servers
- **Cross-Platform**: Works on any modern web browser
- **Offline Capable**: Can be used without internet connection

## File Structure

```
LymphoidTemplate/
├── index.html          # Main application interface
├── styles.css          # Application styling
├── script.js           # Application logic and report generation
├── README.md           # This documentation file
├── Instructions.txt    # Original requirements
└── TEMPLATE.txt        # Reference templates
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Installation

1. Download all files to a local directory
2. Open `index.html` in any modern web browser
3. No installation or setup required

## Security Features

- **No Data Storage**: Information is not saved or stored anywhere
- **No Network Requests**: Application functions completely offline
- **Client-Side Only**: All processing occurs in the user's browser
- **No Cookies**: No tracking or persistent data collection

## Customization

The application can be customized by modifying:

- `styles.css` for visual appearance
- `script.js` for report generation logic
- `index.html` for form structure and fields

## Support

This application is designed for pathologists and medical professionals. For technical support or feature requests, please refer to the original requirements in `Instructions.txt`.

## License

This application is provided as-is for educational and professional use. Please ensure compliance with your institution's policies and procedures when using this tool for clinical documentation.
