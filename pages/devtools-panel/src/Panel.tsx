import { usePageListeners } from '@src/hooks/usePageListeners';
import UI from '@src/views/ui';

export default function Panel() {
  usePageListeners();
  return <UI></UI>;
}
