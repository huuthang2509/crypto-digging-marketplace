import { useEffect } from 'react';

function OnClickOutside(
  mainRef: any,
  handler: (event: any) => any,
  exceptionRef?: any // treat like mainRef
) {
  useEffect(() => {
    const listener = (event: any) => {
      if (exceptionRef && exceptionRef.current.contains(event.target)) return;

      if (!mainRef.current || mainRef.current.contains(event.target)) return;

      handler(event);
    };

    document.addEventListener('mousedown', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [mainRef, handler]);
}

export default OnClickOutside;
