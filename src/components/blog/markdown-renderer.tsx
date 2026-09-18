import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Image from 'next/image'
import Link from 'next/link'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-archivo prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-[var(--ink)] prose-p:text-[var(--iron)] prose-p:leading-relaxed prose-a:text-[var(--volt)] prose-a:bg-[var(--ink)] prose-a:px-1 prose-a:font-bold prose-a:no-underline hover:prose-a:bg-[var(--volt)] hover:prose-a:text-[var(--ink)] prose-strong:text-[var(--ink)] prose-blockquote:border-[var(--volt)] prose-blockquote:bg-[var(--bone)] prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:text-[var(--ink)] prose-blockquote:not-italic prose-li:text-[var(--iron)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: (props) => {
            return (
              <figure className="my-8">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded bg-gray-100 border border-[var(--iron)]/10">
                  <Image
                    src={(props.src as string) || ''}
                    alt={props.alt || ''}
                    fill
                    className="object-cover saturate-[0.9]"
                  />
                </div>
                {props.alt && (
                  <figcaption className="mt-3 text-center text-sm font-mono text-[var(--iron)] uppercase tracking-wider">
                    {props.alt}
                  </figcaption>
                )}
              </figure>
            )
          },
          h2: ({node, ...props}) => {
            const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
            return <h2 id={id} className="scroll-mt-32 border-b border-[var(--iron)]/10 pb-2 mt-12 mb-6" {...props} />
          },
          h3: ({node, ...props}) => {
            const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
            return <h3 id={id} className="scroll-mt-32 mt-8 mb-4" {...props} />
          },
          a: ({node, ...props}) => {
            if (props.href?.startsWith('http')) {
              return <a target="_blank" rel="noopener noreferrer" {...props} />
            }
            return <Link href={props.href || '#'} {...props as any} />
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
