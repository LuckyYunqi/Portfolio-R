from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Image,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "documents"
OUT_DIR.mkdir(exist_ok=True)
PDF_PATH = OUT_DIR / "Reyniel_Polancos_Portfolio_Journal.pdf"
PROFILE_IMAGE = ROOT / "images" / "profile" / "reyniel-polancos.png"
MOBILELEX_IMAGE = ROOT / "images" / "projects" / "mobilelex-dashboard.jpg"

PURPLE = colors.HexColor("#5E1B7A")
MAGENTA = colors.HexColor("#C95CFF")
DEEP = colors.HexColor("#1A052A")
MUTED = colors.HexColor("#6B5878")
PANEL = colors.HexColor("#F6EFFA")
LINE = colors.HexColor("#D9BEE8")
INK = colors.HexColor("#2C2233")
SOFT = colors.HexColor("#FBF7FD")


def styles():
    base = getSampleStyleSheet()
    return {
        "kicker": ParagraphStyle(
            "Kicker",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=11,
            textColor=MAGENTA,
            alignment=TA_LEFT,
            spaceAfter=8,
        ),
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=30,
            leading=34,
            textColor=DEEP,
            alignment=TA_LEFT,
            spaceAfter=8,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=16,
            textColor=PURPLE,
            spaceAfter=10,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=INK,
            spaceAfter=7,
        ),
        "muted": ParagraphStyle(
            "Muted",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=MUTED,
            spaceAfter=4,
        ),
        "h1": ParagraphStyle(
            "Heading1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=PURPLE,
            spaceBefore=12,
            spaceAfter=7,
        ),
        "h2": ParagraphStyle(
            "Heading2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            textColor=DEEP,
            spaceBefore=8,
            spaceAfter=5,
        ),
        "small_center": ParagraphStyle(
            "SmallCenter",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=8.5,
            leading=11,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
        "footer": ParagraphStyle(
            "Footer",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
    }


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(doc.leftMargin, 0.55 * inch, letter[0] - doc.rightMargin, 0.55 * inch)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawCentredString(letter[0] / 2, 0.36 * inch, f"Reyniel Polancos | Fresh IT Graduate Portfolio | Page {doc.page}")
    canvas.restoreState()


def p(text, style):
    return Paragraph(text, style)


def bullet_list(items, style):
    return ListFlowable(
        [ListItem(Paragraph(item, style), leftIndent=10) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=16,
        bulletFontName="Helvetica",
        bulletFontSize=7,
    )


def info_table(data, widths):
    table = Table(data, colWidths=widths, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.6, LINE),
                ("BACKGROUND", (0, 0), (0, -1), PANEL),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("TEXTCOLOR", (0, 0), (0, -1), PURPLE),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ]
        )
    )
    return table


def section_card(content):
    table = Table([[content]], colWidths=[6.65 * inch], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("BACKGROUND", (0, 0), (-1, -1), PANEL),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return table


def build():
    s = styles()
    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=letter,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.72 * inch,
        bottomMargin=0.72 * inch,
        title="Reyniel Polancos Portfolio Journal",
        author="Reyniel Polancos",
    )
    story = []

    left = [
        p("PORTFOLIO JOURNAL", s["kicker"]),
        p("Reyniel Polancos", s["title"]),
        p("Fresh IT Graduate | Frontend & Mobile App Development", s["subtitle"]),
        p(
            "A concise portfolio prepared for journal requirements, highlighting academic background, technical skills, projects, certifications, and career readiness for entry-level developer roles.",
            s["body"],
        ),
        Spacer(1, 8),
        info_table(
            [
                ["Current Status", "Fresh Graduate"],
                ["Target Role", "Junior Developer"],
                ["Focus", "Frontend & Mobile App"],
                ["Location", "Digos City, Davao del Sur"],
                ["Email", "reynren11@gmail.com"],
                ["GitHub", "github.com/LuckyYunqi"],
            ],
            [1.55 * inch, 3.2 * inch],
        ),
        Spacer(1, 10),
        section_card(
            [
                p("<b>Portfolio Summary</b>", s["body"]),
                p(
                    "This journal portfolio presents my preparation for an entry-level development role through academic background, technical skills, sample projects, certifications, and reflections on professional readiness.",
                    s["body"],
                ),
            ]
        ),
        Spacer(1, 8),
        bullet_list(
            [
                "Primary interest: frontend and mobile app development",
                "Current learning focus: React JS, React Native, UI consistency, and project documentation",
                "Career direction: junior developer role where I can contribute, learn, and improve through real work",
            ],
            s["body"],
        ),
    ]
    right = []
    if PROFILE_IMAGE.exists():
        img = Image(str(PROFILE_IMAGE), width=1.9 * inch, height=2.25 * inch)
        img.hAlign = "CENTER"
        right.append(img)
    right.extend(
        [
            Spacer(1, 8),
            p("Prepared for Portfolio / Journal Submission", s["small_center"]),
            Spacer(1, 14),
            info_table(
                [
                    ["Document Type", "Portfolio Journal"],
                    ["Purpose", "Academic / Job Preparation"],
                    ["Prepared By", "Reyniel Polancos"],
                ],
                [1.0 * inch, 1.0 * inch],
            ),
        ]
    )
    cover = Table([[left, right]], colWidths=[4.95 * inch, 2.0 * inch])
    cover.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.extend([cover, PageBreak()])

    story.append(p("Career Objective", s["h1"]))
    story.append(
        section_card(
            [
                p("<b>Objective</b>", s["body"]),
                p(
                    "To contribute as an entry-level frontend or mobile app developer while strengthening real-world development practices, code quality, collaboration, and user-centered problem solving.",
                    s["body"],
                ),
            ]
        )
    )

    story.append(p("About Me", s["h1"]))
    story.append(
        p(
            "I am Reyniel Polancos, a fresh IT graduate with a foundation in web design, frontend development, and practical React-based project work. I build clean, responsive interfaces and continue improving through hands-on projects using HTML, CSS, React JS, and React Native.",
            s["body"],
        )
    )
    story.append(
        p(
            "I have beginner-level practical experience in mobile app development, including React Native app structure, screens, navigation concepts, and connecting user-focused features into a usable interface.",
            s["body"],
        )
    )

    story.append(p("Skills Profile", s["h1"]))
    skills = info_table(
        [
            ["Frontend", "HTML, CSS, React JS"],
            ["Mobile", "React Native"],
            ["Design / Editing", "Photoshop, Premiere Pro, After Effects"],
            ["Tools", "GitHub, VS Code, XAMPP"],
        ],
        [1.65 * inch, 5.0 * inch],
    )
    story.append(skills)

    story.append(p("Technical Readiness", s["h1"]))
    story.append(
        info_table(
            [
                ["Interface Building", "Can create responsive sections, cards, navigation, and contact UI using HTML/CSS/JavaScript."],
                ["React Foundation", "Understands component-based structure and continues practicing React JS and React Native concepts."],
                ["Mobile Screens", "Has practical exposure to React Native screen layouts, navigation ideas, and user-flow planning."],
                ["Work Habits", "Willing to document tasks, accept feedback, improve code quality, and learn development workflows."],
            ],
            [1.8 * inch, 4.85 * inch],
        )
    )

    story.append(PageBreak())
    story.append(p("Education", s["h1"]))
    story.append(
        info_table(
            [
                ["University of Mindanao", "College Graduate | Digos City, Davao del Sur"],
                ["University of Mindanao", "Senior High School | Digos City, Davao del Sur"],
                ["Holy Cross Academy of Digos", "Junior High School | Digos City, Davao del Sur"],
                ["Ramon Magsaysay Elementary School", "Elementary | Digos City, Davao del Sur"],
            ],
            [2.35 * inch, 4.3 * inch],
        )
    )

    story.append(p("Projects", s["h1"]))
    mobile_content = [
        p("<b>Lawyer Consultation Mobile App</b>", s["h2"]),
        bullet_list(
            [
                "Type: Mobile App",
                "Role: Mobile App Developer",
                "Tech Stack: React Native, mobile app screens, consultation workflows",
                "Repository: github.com/xxexil/MobileLex",
                "Description: A lawyer consultation app focused on schedules, messages, payments, and client-centered consultation flows.",
            ],
            s["body"],
        ),
    ]
    if MOBILELEX_IMAGE.exists():
        screenshot = Image(str(MOBILELEX_IMAGE), width=1.65 * inch, height=3.25 * inch)
        screenshot.hAlign = "CENTER"
        mobile_content.append(screenshot)
        mobile_content.append(p("MobileLex dashboard screen", s["small_center"]))
    story.append(section_card(mobile_content))

    story.append(PageBreak())
    story.append(p("Project Learning Notes", s["h2"]))
    story.append(
        bullet_list(
            [
                "Improved understanding of how mobile screens connect to user workflows.",
                "Practiced organizing app features around real user needs such as consultations, messages, schedules, and payments.",
                "Learned the importance of clear navigation and readable interface hierarchy in mobile applications.",
            ],
            s["body"],
        )
    )

    project_rows = [
        ("Inventory of Medicines System (IMES)", "Developer / System Contributor", "Web app, inventory management, reports", "Screenshot unavailable because the system was turned over to the client."),
        ("Personal Portfolio Website", "Web Designer / Frontend Developer", "HTML, CSS, JavaScript", "Responsive portfolio website presenting profile, education, certificates, projects, skills, and contact information."),
        ("Responsive Web Design", "Frontend Practice", "HTML, CSS, accessibility, responsive layouts", "Coursework and practice focused on responsive layouts and mobile-first fundamentals."),
    ]
    for title, role, stack, desc in project_rows:
        story.append(KeepTogether([p(title, s["h2"]), bullet_list([f"Role: {role}", f"Tech Stack: {stack}", desc], s["body"])]))

    story.append(p("Certifications", s["h1"]))
    story.append(
        bullet_list(
            [
                "Installing and Configuring Computer Systems - TESDA (Completed September 5, 2025)",
                "Setting Up Computer Networks - TESDA (Completed September 5, 2025)",
                "Setting Up Computer Servers - TESDA (Completed September 5, 2025)",
                "Maintaining Computer Systems and Networks - TESDA (Completed September 5, 2025)",
                "Introduction to CSS - TESDA (Completed September 1, 2025)",
                "IT Specialist: HTML and CSS - Certiport / Pearson VUE (Completed February 28, 2026)",
            ],
            s["body"],
        )
    )

    story.append(PageBreak())
    story.append(p("OJT / Career Preparation", s["h1"]))
    story.append(
        section_card(
            [
                p("<b>Readiness Statement</b>", s["body"]),
                p(
                    "I am prepared to enter a real development environment as a fresh graduate who is willing to learn, accept feedback, document tasks, communicate clearly, and improve through daily practice.",
                    s["body"],
                ),
            ]
        )
    )
    story.append(
        bullet_list(
            [
                "Strengthen React JS and React Native fundamentals through small, complete projects.",
                "Practice GitHub workflow, code organization, and project documentation.",
                "Continue improving UI consistency, responsive layouts, and accessibility.",
                "Prepare for interviews by explaining project role, decisions, challenges, and learning outcomes.",
            ],
            s["body"],
        )
    )

    story.append(p("Development Plan", s["h1"]))
    story.append(
        info_table(
            [
                ["Short-Term Goal", "Improve React JS and React Native fundamentals through guided practice and portfolio updates."],
                ["Portfolio Goal", "Document each project with role, tools, features, lessons learned, and available repository links."],
                ["Workplace Goal", "Develop strong habits in communication, task tracking, code review, and accepting technical feedback."],
                ["Professional Goal", "Grow into a reliable junior developer who can contribute to frontend and mobile app development tasks."],
            ],
            [1.7 * inch, 4.95 * inch],
        )
    )

    story.append(p("Professional Strengths", s["h1"]))
    story.append(
        bullet_list(
            [
                "Willingness to learn from senior developers, instructors, and real project feedback.",
                "Interest in creating clean, user-centered interfaces for web and mobile applications.",
                "Ability to continue improving through self-study, hands-on practice, and documentation.",
                "Prepared to start with entry-level responsibilities and grow through consistent effort.",
            ],
            s["body"],
        )
    )

    story.append(p("Reflection", s["h1"]))
    story.append(
        p(
            "This portfolio represents my current growth as a fresh IT graduate. It shows my academic foundation, beginner-level practical experience, and willingness to continue learning in a company related to my expertise.",
            s["body"],
        )
    )

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(PDF_PATH)


if __name__ == "__main__":
    build()
