import { Fragment } from 'react'

/**
 * Splits text into words wrapped for reveal animations.
 *   <SplitText as="h2" text={['Line one', 'Line *two*']} data-reveal="words" />
 * • Pass an array for explicit line breaks.
 * • Wrap a word in *asterisks* to set it in the italic serif.
 * Screen readers get the plain sentence via aria-label.
 */
export default function SplitText({ as: Tag = 'span', text, className = '', lineClassName = '', ...rest }) {
  const lines = Array.isArray(text) ? text : [text]
  const plain = lines.join(' ').replaceAll('*', '')

  return (
    <Tag className={className} aria-label={plain} {...rest}>
      {lines.map((line, i) => (
        <span key={i} className={`split-line ${lineClassName}`} aria-hidden="true" style={{ display: 'block' }}>
          {line.split(' ').map((word, j, arr) => {
            const serif = /^\*.*\*[.,!?]?$/.test(word)
            const clean = word.replaceAll('*', '')
            return (
              <Fragment key={j}>
                <span className="split-word">
                  <span className={`split-inner${serif ? ' serif' : ''}`}>{clean}</span>
                </span>
                {j < arr.length - 1 && ' '}
              </Fragment>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}
