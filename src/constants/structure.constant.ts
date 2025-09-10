// // const youtube = {
// //   "type": "object",
// //   "description": "Structured output schema for AI-generated YouTube video notes",
// //   "required": ["noteTitle", "note", "transcriptOfVideo", "metaData", "language"],
// //   "properties": {
// //     "noteTitle": {
// //       "type": "string",
// //       "description": "Concise title for the notes with one relevant emoji at the start",
// //       "pattern": "^[\\p{Emoji}].*",
// //       "examples": ["📚 Machine Learning Fundamentals", "🚀 Startup Growth Strategies", "🎯 Productivity Hacks for Developers"]
// //     },
// //     "note": {
// //       "type": "string",
// //       "description": "Complete structured notes in Markdown format following the specified template",
// //       "minLength": 500
// //     },
// //     "transcriptOfVideo": {
// //       "type": "string",
// //       "description": "Well-structured transcript in Markdown format with proper formatting, timestamps, and speaker identification"
// //     },
// //     "metaData": {
// //       "type": "object",
// //       "description": "Essential metadata about the video and note generation",
// //       "required": ["duration", "dateGenerated", "videoType"],
// //       "properties": {
// //         "duration": {
// //           "type": "string",
// //           "description": "Duration of the video in format like '15:30' or '1:23:45'",
// //           "pattern": "^([0-9]+:)?[0-5]?[0-9]:[0-5][0-9]$",
// //           "examples": ["5:30", "23:45", "1:15:30"]
// //         },
// //         "dateGenerated": {
// //           "type": "string",
// //           "description": "Date when notes were generated in ISO format",
// //           "format": "date",
// //           "examples": ["2025-08-31"]
// //         },
// //         "videoType": {
// //           "type": "string",
// //           "description": "Category/type of the video content",
// //           "enum": [
// //             "Educational",
// //             "Tutorial",
// //             "Lecture",
// //             "Interview",
// //             "Documentary",
// //             "Webinar",
// //             "Conference Talk",
// //             "Product Demo",
// //             "Review",
// //             "News/Analysis",
// //             "Podcast",
// //             "Workshop",
// //             "Other"
// //           ]
// //         }
// //       },
// //       "additionalProperties": false
// //     },
// //     "language": {
// //       "type": "string",
// //       "description": "Detected language of the video content (ISO 639-1 code)",
// //       "examples": ["en", "es", "fr", "de", "hi", "ja", "ko", "zh", "ar", "pt", "ru", "it"]
// //     }
// //   },
// //   "additionalProperties": false
// // }
// const pdf = {
//   "type": "object",
//   "description": "Structured output schema for AI-generated PDF document notes",
//   "required": ["noteTitle", "note", "documentText", "metaData", "language"],
//   "properties": {
//     "noteTitle": {
//       "type": "string",
//       "description": "Concise title for the notes with one relevant emoji at the start"
//     },
//     "note": {
//       "type": "string",
//       "description": "Complete structured notes in Markdown format following the specified template",
//       "minLength": 800
//     },
//     "documentText": {
//       "type": "string",
//       "description": "Complete raw text content extracted from the PDF document, preserving original formatting and structure",
//       "minLength": 100
//     },
//     // "documentSummary": {
//     //   "type": "string",
//     //   "description": "Brief 2-3 sentence overview of what the document covers",
//     //   "maxLength": 300
//     // },
//     "metaData": {
//       "type": "object",
//       "description": "Essential metadata about the document and note generation",
//       "required": ["pageCount", "documentType", "estimatedReadingTime"],
//       "properties": {
//         "pageCount": {
//           "type": "integer",
//           "description": "Total number of pages in the document",
//           "minimum": 1
//         },
//         "documentType": {
//           "type": "string",
//           "description": "Category/type of the document content",
//           "enum": [
//             "Research Paper",
//             "Technical Manual",
//             "Business Report",
//             "Academic Textbook",
//             "Legal Document",
//             "Case Study",
//             "White Paper",
//             "User Guide",
//             "Policy Document",
//             "Financial Report",
//             "Medical Document",
//             "Educational Material",
//             "Government Document",
//             "Technical Specification",
//             "Standard Operating Procedure",
//             "Contract/Agreement",
//             "Proposal",
//             "Other"
//           ]
//         },
//         "estimatedReadingTime": {
//           "type": "integer",
//           "description": "Estimated reading time for the original document in minutes",
//           "minimum": 1
//         },
//         "documentSource": {
//           "type": "string",
//           "description": "Source of the document if available"
//         }
//       }
//     },
//     "language": {
//       "type": "string",
//       "description": "Detected language of the document content (ISO 639-1 code)"
//     }
//   },
//   "additionalProperties": false
// }
// const audio = {
//   type: "object",
//   properties: {
//     noteTitle: {
//       type: "string",
//       description: "Concise title for the notes with one relevant emoji at the start"
//     },
//     note: {
//       type: "string",
//       description: "Complete structured notes in Markdown format following the specified template"
//     },
//     audioTranscript: {
//       type: "string",
//       description: "Complete transcript of the audio content with speaker attributions and timestamps if available"
//     },
//     audioSummary: {
//       type: "string",
//       description: "Brief 2-3 sentence overview of what the audio content covers"
//     },
//     metaData: {
//       type: "object",
//       properties: {
//         duration: {
//           type: "string",
//           description: "Duration of the audio in format like '15:30' or '1:23:45'"
//         },
//         audioType: {
//           type: "string",
//           description: "Category/type of the audio content",
//           enum: [
//             "Podcast",
//             "Interview",
//             "Lecture",
//             "Educational Content",
//             "Meeting/Conference Call",
//             "Presentation",
//             "Webinar",
//             "Workshop",
//             "Panel Discussion",
//             "Audiobook",
//             "Music/Song",
//             "Radio Show",
//             "Documentary",
//             "News/Broadcast",
//             "Voice Memo",
//             "Training Material",
//             "Storytelling",
//             "Other"
//           ]
//         },
//         speakerCount: {
//           type: "integer",
//           description: "Number of distinct speakers in the audio"
//         },
//         audioSource: {
//           type: "string",
//           description: "Source of the audio if available (podcast name, channel, platform, etc.)"
//         }
//       },
//       required: ["duration", "audioType", "speakerCount"]
//     },
//     language: {
//       type: "string",
//       description: "Detected language of the audio content (ISO 639-1 code)"
//     }
//   },
//   required: ["noteTitle", "note", "audioTranscript", "audioSummary", "metaData", "language"]
// };

// const video = {
//   "type": "object",
//   "properties": {
//     "title": {
//       "type": "string",
//       "description": "Generate a clear, descriptive title (3-8 words) that captures the main topic",
//       "maxLength": 100
//     },
//     "summary": {
//       "type": "string",
//       "description": "Write a concise 2-3 sentence summary of the main content and key takeaways",
//       "maxLength": 300
//     },
//     "key_points": {
//       "type": "array",
//       "description": "Extract 3-7 most important points as bullet points. Each should be actionable or memorable.",
//       "items": {
//         "type": "string",
//         "maxLength": 150
//       },
//       "minItems": 3,
//     },
//     "sections": {
//       "type": "array",
//       "description": "Organize content into 2-5 logical sections with clear headings and detailed content",
//       "items": {
//         "type": "object",
//         "properties": {
//           "heading": {
//             "type": "string",
//             "description": "Clear section heading (2-5 words)",
//             "maxLength": 50
//           },
//           "content": {
//             "type": "string",
//             "description": "Detailed section content with explanations, examples, or elaboration",
//             "maxLength": 500
//           }
//         },
//         "required": ["heading", "content"],
//         "additionalProperties": false
//       },
//       "minItems": 2,
//       "maxItems": 5
//     },
//     "language": {
//       "type": "string",
//       "description": "language of note"
//     }
//   },
//   "required": ["title", "summary", "key_points", "sections",'language'],
//   "additionalProperties": false
// };

// const youtube = {
//   "type": "object",
//   "properties": {
//     "title": {
//       "type": "string",
//       "description": "Generate a clear, descriptive title (3-8 words) that captures the main topic",
//       "maxLength": 100
//     },
//     "summary": {
//       "type": "string",
//       "description": "Write a concise 2-3 sentence summary of the main content and key takeaways",
//       "maxLength": 300
//     },
//     "key_points": {
//       "type": "array",
//       "description": "Extract 3-7 most important points as bullet points. Each should be actionable or memorable.",
//       "items": {
//         "type": "string",
//         "maxLength": 150
//       },
//       "minItems": 3,
//     },
//     "sections": {
//       "type": "array",
//       "description": "Organize content into 2-5 logical sections with clear headings and detailed content",
//       "items": {
//         "type": "object",
//         "properties": {
//           "heading": {
//             "type": "string",
//             "description": "Clear section heading (2-5 words)",
//             "maxLength": 50
//           },
//           "content": {
//             "type": "string",
//             "description": "Detailed section content with explanations, examples, or elaboration",
//             "maxLength": 500
//           }
//         },
//         "required": ["heading", "content"],
//         "additionalProperties": false
//       },
//       "minItems": 2,
//       "maxItems": 5
//     },
//     "language": {
//       "type": "string",
//       "description": "language of note"
//     }
//   },
//   "required": ["title", "summary", "key_points", "sections",'language'],
//   "additionalProperties": false
// }

// const structureOutputJSONSchema = {
//   youtube: youtube,
//   pdf: pdf,
//   audio: audio,
//   web: '',
//   video: video
// };

// export default structureOutputJSONSchema;

export const responseFormat = {
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Generate a clear, descriptive title (3-8 words) that captures the main topic",
      "maxLength": 100
    },
    "summary": {
      "type": "string",
      "description": "Write a concise 2-3 sentence summary of the main content and key takeaways",
      "maxLength": 300
    },
    "key_points": {
      "type": "array",
      "description": "Extract 3-7 most important points as bullet points. Each should be actionable or memorable.",
      "items": {
        "type": "string",
        "maxLength": 150
      },
      "minItems": 3,
    },
    "sections": {
      "type": "array",
      "description": "Organize content into 2-5 logical sections with clear headings and detailed content",
      "items": {
        "type": "object",
        "properties": {
          "heading": {
            "type": "string",
            "description": "Clear section heading (2-5 words)",
            "maxLength": 50
          },
          "content": {
            "type": "string",
            "description": "Detailed section content with explanations, examples, or elaboration",
            "maxLength": 1000
          }
        },
        "required": ["heading", "content"],
        "additionalProperties": false
      },
      "minItems": 2,
    },
    "language": {
      "type": "string",
      "description": "language of note"
    }
  },
  "required": ["title", "summary", "key_points", "sections", 'language'],
  "additionalProperties": false
}

