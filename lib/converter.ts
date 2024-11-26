interface Content {
  type: string;
  text?: string;
  name?: string;
  input?: any;
  content?: Array<{ text: string }>;
}

interface Message {
  sender: string;
  created_at: string;
  content: Content[];
  attachments: Array<{
    file_name: string;
    extracted_content: string;
  }>;
}

interface ParsedData {
  name: string;
  chat_messages: Message[];
}

const typeLookup: Record<string, string> = {
  "application/vnd.ant.react": "jsx",
  "text/html": "html"
};

function replaceArtifactTags(input: string): string {
  const regex = /<antArtifact[^>]*>/g;

  function extractAttributes(tag: string) {
    const attributes: Record<string, string> = {};
    const attrRegex = /(\w+)=("([^"]*)"|'([^']*)')/g;
    let match;
    while ((match = attrRegex.exec(tag)) !== null) {
      const key = match[1];
      const value = match[3] || match[4];
      attributes[key] = value;
    }
    return attributes;
  }

  return input.replace(regex, (match) => {
    const attributes = extractAttributes(match);
    const lang = attributes.language || typeLookup[attributes.type] || "";
    return `### ${attributes.title || "Untitled"}\n\n\`\`\`${lang}`;
  });
}

export function convertToMarkdown(parsed: ParsedData): string {
  if (!parsed.chat_messages) {
    return "";
  }

  const bits: string[] = [];
  bits.push(`# ${parsed.name}`);

  parsed.chat_messages.forEach((message) => {
    bits.push(
      `**${message.sender}** (${new Date(message.created_at).toLocaleString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }
      )})`
    );

    message.content.forEach((content) => {
      if (content.type == "tool_use") {
        if (content.name == "repl") {
          bits.push(
            "**Analysis**\n```" +
              `javascript\n${content.input.code.trim()}` +
              "\n```"
          );
        } else if (content.name == "artifacts") {
          let lang =
            content.input.language || typeLookup[content.input.type] || "";
          
          const input = content.input;
          if (input.command == "create" || input.command == "rewrite") {
            bits.push(
              `#### ${input.command} ${
                content.input.title || "Untitled"
              }\n\n\`\`\`${lang}\n${content.input.content}\n\`\`\``
            );
          } else if (input.command == "update") {
            bits.push(
              `#### update ${content.input.id}\n\nFind this:\n\`\`\`\n${content.input.old_str}\n\`\`\`\nReplace with this:\n\`\`\`\n${content.input.new_str}\n\`\`\``
            );
          }
        }
      } else if (content.type == "tool_result") {
        if (content.name != "artifacts") {
          if (content.content && content.content.length > 0) {
            let logs = JSON.parse(content.content[0].text).logs;
            bits.push(
              `**Result**\n<pre style="white-space: pre-wrap">\n${logs.join(
                "\n"
              )}\n</pre>`
            );
          }
        }
      } else {
        if (content.text) {
          bits.push(
            replaceArtifactTags(
              content.text.replace(/<\/antArtifact>/g, "\n```")
            )
          );
        } else {
          bits.push(JSON.stringify(content));
        }
      }
    });

    const backtick = String.fromCharCode(96);
    message.attachments.forEach((attachment) => {
      bits.push(`<details><summary>${attachment.file_name}</summary>`);
      bits.push("\n\n");
      bits.push(backtick.repeat(5));
      bits.push(attachment.extracted_content);
      bits.push(backtick.repeat(5));
      bits.push("</details>");
    });
  });

  return bits.join("\n\n");
} 