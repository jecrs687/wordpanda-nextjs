import { useCallback, useEffect, useRef, useState } from 'react';

type TypeWriterProps = {
  delay: number;
  children: React.ReactNode;
  after?: React.ReactNode;
};

const TypeWriter = ({ delay, children, after = null }) => {
  const [tree, setTree] = useState({});
  const [showAfter, setShowAfter] = useState(false);
  const ref = useRef(null);


  const findInsideText = useCallback((element: any) => {
    if (element.nodeName === '#text') {
      const text = element.textContent;
      element.nodeValue = '';
      element.innerText = '';
      element.textContent = '';
      return { text }
    }
    if (!element.childNodes) return;
    return {
      children: [...element.childNodes].map((child: any) => findInsideText(child))
    }
  }, [])

  useEffect(() => {
    let tree;
    if (ref.current)
      setTree(findInsideText(ref.current));
  }, [findInsideText, ref]);

  const insertLetter = useCallback(async (element: any, text: string[]) => {
    let letter = text.shift();
    const isLetterOrNumberOrSymbol = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

    element.textContent += letter;
    if (isLetterOrNumberOrSymbol.test(letter))
      await new Promise((resolve) => setTimeout(resolve, delay));
    if (text.length) {
      await insertLetter(element, text);
    }
    return;
  }, [delay])
  const navigateToText = useCallback(async (element: any, tree: any) => {
    if (!tree) return;
    if (tree.text) {
      await insertLetter(element, tree.text.split(''))
    } else {
      for (let i = 0; i < element.childNodes.length; i++) {
        await navigateToText(element.childNodes[i], tree.children[i])
      }
    }
  }, [insertLetter])
  useEffect(() => {
    if (!Object.keys(tree).length) return;
    navigateToText(ref.current, tree).then(() => {
      setShowAfter(true);
    })
  }, [tree, ref, navigateToText])

  if (!children) return null;
  return <><div
    style={{
      display: !Object.keys(tree).length ? 'none' : 'block'
    }}
    ref={ref}
  >
    {children}
  </div>
    {showAfter && after}
  </>;
};

export default TypeWriter;