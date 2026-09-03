import { useCallback, useEffect, useMemo, useState } from 'react';
import { img } from './data/images.js';

const WHATSAPP_NUMBER = '+2348130987906';
const FEATURED_NAME = 'TEÁH Hobo Crescent Bag';
const SIZE_LIST = ['S', 'M', 'L'];

const PALETTE = [
  { name: 'Wine', hex: '#6E1B2F', slot: 'f-wine' },
  { name: 'Black', hex: '#141414', slot: 'f-black' },
  { name: 'Bone', hex: '#EFE7DF', slot: 'f-bone' },
  { name: 'Cognac', hex: '#8A5A34', slot: 'f-cognac' },
];

const PRODUCTS = [
  {
    slot: 'p2',
    name: 'TEÁH Custom Hobo',
    desc: 'Roomy and light for daily carry, or structured and clean for the office, built the way you ask for it.',
    hasSizes: true,
  },
  {
    slot: 'p4',
    name: 'TEÁH East West Shoulder Bag',
    desc: 'A low, wide shoulder shape that sits close and keeps the look sharp.',
    hasSizes: false,
  },
  {
    slot: 'p5',
    name: 'TEÁH Standard Tote',
    desc: 'Simple, strong and open-top. The one you reach for without thinking.',
    hasSizes: true,
  },
];

function waLink(msg) {
  const n = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`;
}

function CoverImage({ src, alt, alignRight = false }) {
  return (
    <div className="cover-wrap" style={{ position: 'absolute', inset: 0 }}>
      <img src={src} alt={alt} className={alignRight ? 'img-right' : undefined} />
    </div>
  );
}

function SizeButtons({ sizeKey, sizes, onPick }) {
  const current = sizes[sizeKey] ?? 'M';
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {SIZE_LIST.map((z) => {
        const on = current === z;
        return (
          <button
            key={z}
            type="button"
            className="btn-size"
            onClick={() => onPick(sizeKey, z)}
            style={{
              cursor: 'pointer',
              width: 46,
              height: 46,
              fontSize: 13,
              letterSpacing: '0.08em',
              background: on ? '#6E1B2F' : '#fff',
              color: on ? '#fff' : '#141414',
              border: `1px solid ${on ? '#6E1B2F' : 'rgba(20,20,20,0.22)'}`,
            }}
          >
            {z}
          </button>
        );
      })}
    </div>
  );
}

function ColorThumbs({ palette, activeIdx, productSlot, onPick, large, alignRight = false }) {
  const w = alignRight
    ? 'clamp(72px, 12vw, 96px)'
    : large
      ? 'clamp(40px, 7vw, 58px)'
      : 'clamp(46px, 8vw, 66px)';
  const h = large ? 'clamp(50px, 8.6vw, 72px)' : 'clamp(58px, 10vw, 82px)';

  return (
    <>
      {palette.map((c, i) => {
        const key = productSlot ? `${productSlot}-${c.name.toLowerCase()}` : c.slot;
        const active = i === activeIdx;
        return (
          <div
            key={key}
            role="button"
            tabIndex={0}
            title={c.name}
            className="color-thumb"
            onClick={() => onPick(i)}
            onKeyDown={(e) => e.key === 'Enter' && onPick(i)}
            style={{
              width: w,
              height: h,
              border: `1px solid ${active ? '#6E1B2F' : 'rgba(20,20,20,0.14)'}`,
              outline: `1px solid ${active ? '#6E1B2F' : 'transparent'}`,
            }}
          >
            <img src={img(key)} alt={c.name} className={alignRight ? 'img-right' : undefined} />
          </div>
        );
      })}
    </>
  );
}

function ProductCarousel({ palette, activeIdx, productSlot, placeholderPrefix, alignRight = false }) {
  const slideKey = (c) =>
    productSlot === 'f' || !productSlot ? c.slot : `${productSlot}-${c.name.toLowerCase()}`;

  return (
    <div className="carousel-track" style={{ transform: `translateX(${-activeIdx * 100}%)` }}>
      {palette.map((c) => {
        const key = slideKey(c);
        return (
          <div key={key} className="carousel-slide">
            <CoverImage
              src={img(key)}
              alt={`${placeholderPrefix} - ${c.name}`}
              alignRight={alignRight}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState({});
  const [sizes, setSizes] = useState({});
  const [cart, setCart] = useState([]);

  const idxFor = useCallback((key) => picks[key] ?? index, [picks, index]);
  const pick = useCallback(
    (key, i) => setPicks((s) => ({ ...s, [key]: i })),
    [],
  );
  const sizeOf = useCallback((key) => sizes[key] ?? 'M', [sizes]);
  const setSize = useCallback(
    (key, z) => setSizes((s) => ({ ...s, [key]: z })),
    [],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((s) => (s + 1) % PALETTE.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fIdx = idxFor('featured');
  const activeColor = PALETTE[fIdx];

  const cartMsg = cart.length
    ? `Hi TEÁH Studios! I would like to order:\n${cart
        .map((c, i) =>
          `${i + 1}. ${c.name} - Colour: ${c.color}${c.size ? ` - Size: ${c.size}` : ''}`,
        )
        .join('\n')}\n\nPlease send me the payment details.`
    : '';

  const links = useMemo(
    () => ({
      waGeneral: waLink(
        'Hi TEÁH Studios! I would like to place a custom bag order. Please send me the payment details.',
      ),
      waFeatured: waLink(
        `Hi TEÁH Studios! I would like to order the ${FEATURED_NAME} - Colour: ${activeColor.name} - Size: ${sizeOf('featured')}. Please send me the payment details.`,
      ),
      waCart: waLink(cartMsg),
      waTsuno: waLink(
        'Hi TEÁH Studios! Please add me to the Tsuno Bags waitlist and let me know about the pop up.',
      ),
      waSale: waLink(
        'Hi TEÁH Studios! I would like to claim a Bespoke Season slot. Please send me the payment details.',
      ),
    }),
    [activeColor.name, cartMsg, sizeOf],
  );

  const addFeatured = () =>
    setCart((s) => [
      ...s,
      { name: FEATURED_NAME, color: activeColor.name, size: sizeOf('featured') },
    ]);

  const addProduct = (p) => {
    const pIdx = idxFor(p.slot);
    const pColor = PALETTE[pIdx];
    setCart((s) => [
      ...s,
      {
        name: p.name,
        color: pColor.name,
        size: p.hasSizes ? sizeOf(p.slot) : '',
      },
    ]);
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", color: '#141414', background: '#FBF9F8', overflowX: 'hidden' }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px 20px',
          padding: 'clamp(14px, 2.4vw, 20px) clamp(18px, 4vw, 48px)',
          background: 'rgba(251,249,248,0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(20,20,20,0.08)',
        }}
      >
        <a
          href="#top"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(21px, 4.4vw, 30px)',
            letterSpacing: '0.14em',
            color: '#141414',
            fontWeight: 500,
          }}
        >
          <img
            src="/logo.png"
            alt="TS monogram"
            data-logo-mark
            style={{ height: 38, width: 'auto', mixBlendMode: 'multiply' }}
          />
          <span data-logo-text>
            TEÁH<span style={{ color: '#6E1B2F' }}> STUDIOS</span>
          </span>
        </a>
        <nav
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px clamp(14px, 2.6vw, 34px)',
            fontSize: 'clamp(11px, 1.6vw, 13px)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          <a href="#bags" style={{ color: '#141414' }}>Bags</a>
          <a href="#offer" style={{ color: '#141414' }}>Offer</a>
          <a href="#about" style={{ color: '#141414' }}>About</a>
          <a href="#contact" style={{ color: '#141414' }}>Contact</a>
        </nav>
        <a
          href={links.waGeneral}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa-header"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            background: '#6E1B2F',
            color: '#fff',
            padding: '12px 22px',
            fontSize: 12,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#C9A227',
              display: 'inline-block',
            }}
          />
          Order on WhatsApp
        </a>
      </header>

      {/* Hero */}
      <section
        id="top"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          minHeight: 560,
          background: '#141414',
        }}
      >
        <div
          style={{
            minWidth: 0,
            padding: 'clamp(56px, 8vw, 96px) clamp(22px, 5vw, 72px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 'clamp(18px, 2.4vw, 26px)',
            color: '#fff',
          }}
        >
          <span style={{ fontSize: 12, letterSpacing: '0.34em', textTransform: 'uppercase', color: '#C9909F' }}>
            Custom made in Lagos
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(44px, 7.2vw, 76px)',
              lineHeight: 1,
              fontWeight: 400,
              margin: 0,
              textWrap: 'balance',
            }}
          >
            Bags shaped
            <br />
            around <em style={{ color: '#C9909F', fontStyle: 'italic' }}>you</em>
          </h1>
          <p style={{ maxWidth: 430, margin: 0, fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.72)', fontWeight: 300 }}>
            Hobo silhouettes cut, stitched and finished to order. Choose your leather, your lining, your lace. We build it for you and send the payment details straight to your WhatsApp.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10 }}>
            <a
              href="#bags"
              className="btn-primary-wine"
              style={{
                background: '#6E1B2F',
                color: '#fff',
                padding: '17px 34px',
                fontSize: 12,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              See the collection
            </a>
            <a
              href={links.waGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-light"
              style={{
                border: '1px solid rgba(255,255,255,0.35)',
                color: '#fff',
                padding: '17px 34px',
                fontSize: 12,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              Start a custom order
            </a>
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            minWidth: 0,
            minHeight: 0,
            height: 'clamp(320px, 52vw, 640px)',
            background: '#6E1B2F',
          }}
        >
          <CoverImage src={img('hero')} alt="Hero: signature hobo bag on model" />
        </div>
      </section>

      {/* Bags */}
      <section id="bags" style={{ background: '#FBF9F8', padding: '96px 0' }}>
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            marginBottom: 'clamp(28px, 4vw, 44px)',
            padding: '0 clamp(20px, 5vw, 56px)',
          }}
        >
          <span style={{ fontSize: 12, letterSpacing: '0.34em', textTransform: 'uppercase', color: '#6E1B2F' }}>
            The collection
          </span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(34px, 6vw, 54px)', fontWeight: 400, margin: 0 }}>
            Our Bestseller
          </h2>
          <div style={{ width: 54, height: 1, background: '#6E1B2F' }} />
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(30px, 5.4vw, 46px)',
              fontWeight: 400,
              margin: '14px 0 0',
              lineHeight: 1.08,
            }}
          >
            TEÁH Hobo Crescent Bag
          </h3>
          <p style={{ margin: 0, maxWidth: 560, fontSize: 15.5, lineHeight: 1.7, color: 'rgba(20,20,20,0.66)', fontWeight: 300 }}>
            Offered plain or with a hand-set lace panel, in four house colours.
          </p>
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(360px, 58vw, 760px)',
            overflow: 'hidden',
            background: '#F2ECEA',
          }}
        >
          <ProductCarousel palette={PALETTE} activeIdx={fIdx} productSlot="f" placeholderPrefix="Crescent bag" />
          <span
            style={{
              position: 'absolute',
              top: 26,
              left: 26,
              background: '#6E1B2F',
              color: '#fff',
              padding: '9px 15px',
              fontSize: 10.5,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              pointerEvents: 'none',
            }}
          >
            Bestseller
          </span>
          <button
            type="button"
            aria-label="Previous colour"
            className="btn-carousel"
            onClick={() => pick('featured', (fIdx - 1 + PALETTE.length) % PALETTE.length)}
            style={{
              position: 'absolute',
              left: 26,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 48,
              height: 48,
              borderRadius: '50%',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(20,20,20,0.15)',
              color: '#141414',
              fontSize: 17,
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next colour"
            className="btn-carousel"
            onClick={() => pick('featured', (fIdx + 1) % PALETTE.length)}
            style={{
              position: 'absolute',
              right: 26,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 48,
              height: 48,
              borderRadius: '50%',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(20,20,20,0.15)',
              color: '#141414',
              fontSize: 17,
            }}
          >
            ›
          </button>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 'clamp(14px, 2vw, 26px)',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: 'calc(100% - 24px)',
              gap: 8,
              padding: 10,
              background: 'rgba(255,255,255,0.9)',
            }}
          >
            <ColorThumbs palette={PALETTE} activeIdx={fIdx} productSlot={null} onPick={(i) => pick('featured', i)} large />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            marginTop: 26,
            padding: '0 clamp(20px, 5vw, 56px)',
          }}
        >
          <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(20,20,20,0.5)' }}>
            Size: {sizeOf('featured')}
          </span>
          <SizeButtons sizeKey="featured" sizes={sizes} onPick={setSize} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            flexWrap: 'wrap',
            marginTop: 22,
            padding: '0 clamp(20px, 5vw, 56px)',
          }}
        >
          <button
            type="button"
            className="btn-primary-dark"
            onClick={addFeatured}
            style={{
              cursor: 'pointer',
              background: '#141414',
              color: '#fff',
              border: 'none',
              padding: '16px 32px',
              fontSize: 11.5,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Add to cart
          </button>
          <a
            href={links.waFeatured}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-dark"
            style={{
              border: '1px solid rgba(20,20,20,0.25)',
              color: '#141414',
              padding: '16px 32px',
              fontSize: 11.5,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Order on WhatsApp
          </a>
        </div>

        {/* Rest of collection */}
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 clamp(20px, 5vw, 56px)' }}>
          <div style={{ marginTop: 'clamp(56px, 7vw, 84px)' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '10px 24px',
                paddingBottom: 18,
                borderBottom: '1px solid rgba(20,20,20,0.12)',
                marginBottom: 40,
              }}
            >
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px, 4.4vw, 34px)', fontWeight: 400, margin: 0 }}>
                The rest of the collection
              </h3>
              <span style={{ fontSize: 11.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(20,20,20,0.5)' }}>
                Made to order
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
              {PRODUCTS.map((p) => {
                const pIdx = idxFor(p.slot);
                const pColor = PALETTE[pIdx];
                const waProduct = waLink(
                  `Hi TEÁH Studios! I would like to order the ${p.name} - Colour: ${pColor.name}${p.hasSizes ? ` - Size: ${sizeOf(p.slot)}` : ''}. Please send me the payment details.`,
                );
                return (
                  <article
                    key={p.slot}
                    className="product-card"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
                      background: '#fff',
                      border: '1px solid rgba(20,20,20,0.09)',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        minWidth: 0,
                        minHeight: 0,
                        height: 'clamp(300px, 46vw, 520px)',
                        overflow: 'hidden',
                        background: '#F2ECEA',
                      }}
                    >
                      <ProductCarousel
                        palette={PALETTE}
                        activeIdx={pIdx}
                        productSlot={p.slot}
                        placeholderPrefix={p.name}
                        alignRight={p.slot === 'p4'}
                      />
                    </div>
                    <div
                      style={{
                        minWidth: 0,
                        padding: 'clamp(28px, 4vw, 48px) clamp(22px, 3.4vw, 38px)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 16,
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 'clamp(26px, 4.4vw, 34px)',
                          fontWeight: 400,
                          margin: 0,
                          lineHeight: 1.12,
                        }}
                      >
                        {p.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: 'rgba(20,20,20,0.62)', fontWeight: 300 }}>
                        {p.desc}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <ColorThumbs
                            palette={PALETTE}
                            activeIdx={pIdx}
                            productSlot={p.slot}
                            onPick={(i) => pick(p.slot, i)}
                            alignRight={p.slot === 'p4'}
                          />
                        </div>
                      </div>
                      {p.hasSizes && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
                          <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(20,20,20,0.5)' }}>
                            Size: {sizeOf(p.slot)}
                          </span>
                          <SizeButtons sizeKey={p.slot} sizes={sizes} onPick={setSize} />
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                        <button
                          type="button"
                          className="btn-primary-dark"
                          onClick={() => addProduct(p)}
                          style={{
                            cursor: 'pointer',
                            background: '#141414',
                            color: '#fff',
                            border: 'none',
                            padding: '15px 26px',
                            fontSize: 11,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Add to cart
                        </button>
                        <a
                          href={waProduct}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline-dark"
                          style={{
                            border: '1px solid rgba(20,20,20,0.25)',
                            color: '#141414',
                            padding: '15px 26px',
                            fontSize: 11,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Order on WhatsApp
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Cart sidebar */}
      {cart.length > 0 && (
        <aside
          style={{
            position: 'fixed',
            right: 'clamp(12px, 3vw, 24px)',
            bottom: 'clamp(12px, 3vw, 24px)',
            zIndex: 60,
            width: 'min(316px, calc(100vw - 24px))',
            background: '#fff',
            border: '1px solid rgba(20,20,20,0.14)',
            boxShadow: '0 18px 44px rgba(20,20,20,0.18)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: '#141414',
              color: '#fff',
            }}
          >
            <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Your bag: {cart.length === 1 ? '1 item' : `${cart.length} items`}
            </span>
            <button
              type="button"
              className="btn-clear"
              onClick={() => setCart([])}
              style={{
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ maxHeight: 216, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {cart.map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '13px 18px',
                  borderBottom: '1px solid rgba(20,20,20,0.07)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500 }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: 'rgba(20,20,20,0.55)', fontWeight: 300 }}>
                    Colour: {c.color}
                    {c.size ? ` · Size: ${c.size}` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Remove"
                  className="btn-remove"
                  onClick={() => setCart((s) => s.filter((_, j) => j !== i))}
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(20,20,20,0.4)',
                    fontSize: 15,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <a
            href={links.waCart}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa-cart"
            style={{
              display: 'block',
              textAlign: 'center',
              background: '#6E1B2F',
              color: '#fff',
              padding: 16,
              fontSize: 11.5,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Order on WhatsApp
          </a>
        </aside>
      )}

      {/* Offer */}
      <section
        id="offer"
        style={{
          background: '#6E1B2F',
          color: '#fff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          alignItems: 'center',
          gap: 'clamp(32px, 5vw, 64px)',
          padding: 'clamp(56px, 7vw, 88px) clamp(22px, 5vw, 72px)',
        }}
      >
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 520 }}>
          <span style={{ fontSize: 12, letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
            Limited run
          </span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(36px, 6vw, 60px)',
              lineHeight: 1.05,
              fontWeight: 400,
              margin: 0,
            }}
          >
            Bespoke Season
            <br />
            Up to 20% off
          </h2>
          <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.78)', fontWeight: 300 }}>
            Book a custom hobo this month and the personalisation (lace panel, monogram, lining colour) comes included. Slots are limited to keep every bag hand-finished.
          </p>
          <a
            href={links.waSale}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-offer"
            style={{
              alignSelf: 'flex-start',
              marginTop: 10,
              background: '#fff',
              color: '#6E1B2F',
              padding: '16px 34px',
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Claim your slot
          </a>
          <p style={{ margin: '6px 0 0', fontSize: 12.5, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.5)' }}>
            Payment details are sent on WhatsApp once your order is confirmed.
          </p>
        </div>
        <div
          style={{
            position: 'relative',
            minWidth: 0,
            minHeight: 0,
            height: 'clamp(280px, 40vw, 420px)',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          <CoverImage src={img('offer')} alt="Flat lay: bag, leather swatches, lace" />
        </div>
      </section>

      {/* Tsuno */}
      <section
        style={{
          background: '#FBF9F8',
          padding: 'clamp(52px, 7vw, 72px) clamp(22px, 5vw, 72px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 'clamp(30px, 4.4vw, 56px)',
          alignItems: 'center',
          borderTop: '1px solid rgba(20,20,20,0.08)',
        }}
      >
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 11.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#6E1B2F' }}>
            Coming soon
          </span>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(32px, 5.4vw, 46px)',
              fontWeight: 400,
              margin: 0,
              lineHeight: 1.08,
            }}
          >
            Tsuno Bags
          </h3>
          <p style={{ margin: 0, maxWidth: 420, fontSize: 15.5, lineHeight: 1.75, color: 'rgba(20,20,20,0.66)', fontWeight: 300 }}>
            A new shape joining the studio, launching at a pop up. Message us to be told first when it drops.
          </p>
          <a
            href={links.waTsuno}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-dark"
            style={{
              alignSelf: 'flex-start',
              marginTop: 8,
              border: '1px solid rgba(20,20,20,0.25)',
              color: '#141414',
              padding: '15px 30px',
              fontSize: 11.5,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Join the waitlist
          </a>
        </div>
        <div
          style={{
            position: 'relative',
            minWidth: 0,
            minHeight: 0,
            height: 'clamp(260px, 38vw, 380px)',
            background: '#F2ECEA',
            border: '1px solid rgba(20,20,20,0.09)',
          }}
        >
          <CoverImage src={img('tsuno')} alt="Tsuno bag teaser" />
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          background: '#F2ECEA',
        }}
      >
        <div
          style={{
            minWidth: 0,
            padding: 'clamp(52px, 6.4vw, 80px) clamp(22px, 5vw, 72px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            borderRight: '1px solid rgba(20,20,20,0.08)',
          }}
        >
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4.4vw, 38px)', fontWeight: 400, margin: 0 }}>
            Loved by many
          </h3>
          <div style={{ display: 'flex', gap: 4, color: '#6E1B2F', fontSize: 15, letterSpacing: '0.2em' }}>
            ★★★★★
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              lineHeight: 1.55,
              fontStyle: 'italic',
              color: '#2A2A2A',
            }}
          >
            “I sent a photo of what I wanted and got back something better. The stitching is clean, the leather is soft, and it carries everything.”
          </p>
          <span style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(20,20,20,0.55)' }}>
            Adaeze O., Lagos
          </span>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: 'rgba(20,20,20,0.66)', fontWeight: 300 }}>
            TEÁH Studios is a small business on Lagos Island making custom hobo bags. Every piece is cut by hand, one at a time, for the person who asked for it.
          </p>
        </div>
        <div
          style={{
            minWidth: 0,
            padding: 'clamp(52px, 6.4vw, 80px) clamp(22px, 5vw, 72px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 22,
            background: '#fff',
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(30px, 4.8vw, 40px)',
              fontWeight: 400,
              margin: 0,
              lineHeight: 1.12,
            }}
          >
            Ready to carry something made for you?
          </h3>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: 'rgba(20,20,20,0.66)', fontWeight: 300, maxWidth: 480 }}>
            Tell us the style, the colour and when you need it. We confirm the price, send payment details on WhatsApp, and start cutting.
          </p>
          <a
            href={links.waGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-dark"
            style={{
              alignSelf: 'flex-start',
              background: '#141414',
              color: '#fff',
              padding: '17px 36px',
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Message us now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        style={{
          background: '#141414',
          color: '#fff',
          padding: 'clamp(52px, 6.4vw, 72px) clamp(22px, 5vw, 72px) 0',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: 'clamp(30px, 4vw, 56px)',
            paddingBottom: 'clamp(38px, 5vw, 56px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 30,
                letterSpacing: '0.14em',
              }}
            >
              <img
                src="/logo.png"
                alt="TS monogram"
                style={{ height: 44, width: 'auto', filter: 'invert(1)', mixBlendMode: 'screen' }}
              />
              TEÁH STUDIOS
            </span>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.9, color: 'rgba(255,255,255,0.66)', fontWeight: 300 }}>
              Lagos Island, Nigeria
              <br />
              Email:{' '}
              <a href="mailto:teahstudios11@gmail.com" style={{ color: 'rgba(255,255,255,0.85)' }}>
                teahstudios11@gmail.com
              </a>
              <br />
              WhatsApp: {WHATSAPP_NUMBER}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9909F' }}>
              Quick links
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14, fontWeight: 300 }}>
              <a href="#bags" style={{ color: 'rgba(255,255,255,0.72)' }}>Bags</a>
              <a href="#offer" style={{ color: 'rgba(255,255,255,0.72)' }}>Offer</a>
              <a href="#about" style={{ color: 'rgba(255,255,255,0.72)' }}>About</a>
              <a href={links.waGeneral} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Custom orders
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9909F' }}>
              Follow us
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14, fontWeight: 300 }}>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Instagram: TEÁH Studios
              </a>
              <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.72)' }}>
                TikTok: TEÁH Studios
              </a>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.14)',
            padding: '22px 0 26px',
            textAlign: 'center',
            fontSize: 12,
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          © 2026 TEÁH Studios. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
