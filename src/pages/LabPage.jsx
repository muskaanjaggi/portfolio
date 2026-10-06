import Lab from '../sections/Lab'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function LabPage() {
  useDocumentTitle('The Lab', 'Experiments, sketches, prototypes and half-ideas by Muskaan Jaggi.')
  return <Lab standalone />
}
