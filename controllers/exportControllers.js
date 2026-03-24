const PDFDocument = require('pdfkit');
const TurndownService = require('turndown');
const noteModel = require('../models/noteModel');

const htmlToText = (html) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const turndown = new TurndownService();

class ExportController {
    export_note = async (req, res, next) => {
        const { id: userId } = req;
        const { noteId } = req.params;
        const { format } = req.query;

        if (!['pdf', 'md'].includes(format)) {
            return res.status(400).json({ message: 'Unsupported format. Use pdf or md.' });
        }

        try {
            const note = await noteModel.findOne({ _id: noteId, userId });
            if (!note) return res.status(403).json({ message: 'Forbidden' });

            const safeTitle = note.title.replace(/[^a-z0-9\s-]/gi, '').trim() || 'note';

            if (format === 'pdf') {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);

                const doc = new PDFDocument({ margin: 50 });
                doc.pipe(res);
                doc.fontSize(20).font('Helvetica-Bold').text(note.title, { underline: false });
                doc.moveDown();
                doc.fontSize(12).font('Helvetica').text(htmlToText(note.content), {
                    align: 'left',
                    lineGap: 4
                });
                doc.end();
            } else {
                const contentMd = note.contentType === 'html'
                    ? turndown.turndown(note.content)
                    : note.content;
                const markdown = `# ${note.title}\n\n${contentMd}`;

                res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
                res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.md"`);
                res.end(markdown);
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ExportController();
