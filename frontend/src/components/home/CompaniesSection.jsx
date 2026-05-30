import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const topCompanies = [
  { name: 'FPT Software', logo: 'FPT', color: '#E95420', bgColor: '#FFF3ED' },
  { name: 'Tập đoàn MoMo', logo: 'MoMo', color: '#A50064', bgColor: '#FFF0F7' },
  { name: 'Shopee Việt Nam', logo: 'Shopee', color: '#EE4D2D', bgColor: '#FFF1EE' },
  { name: 'VNG Corporation', logo: 'VNG', color: '#1A73E8', bgColor: '#EEF4FF' },
  { name: 'Techcombank', logo: 'TCB', color: '#ED1C24', bgColor: '#FFF1F1' },
  { name: 'Viettel Group', logo: 'Viettel', color: '#CC0000', bgColor: '#FFF1F1' },
  { name: 'Vingroup', logo: 'VIN', color: '#2B388F', bgColor: '#F0F1FF' },
  { name: 'Tiki', logo: 'Tiki', color: '#1A94FF', bgColor: '#EDF6FF' },
];

function CompaniesSection({ navigate }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  // Double the array for marquee effect
  const marqueeItems = [...topCompanies, ...topCompanies];

  return (
    <section ref={sectionRef} style={{ background: 'white', padding: '80px 0', borderTop: '1px solid #e2e8f0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '48px' }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: 'backOut' }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: '#faf5ff',
              fontSize: '12px',
              fontWeight: 700,
              color: '#7c3aed',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '16px',
              border: '1px solid #ede9fe',
            }}>
            🏢 Đối Tác Tuyển Dụng
          </motion.span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '12px' }}>Công ty đang tuyển dụng mạnh</h2>
          <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>Kết nối với các doanh nghiệp, tập đoàn công nghệ hàng đầu tại Việt Nam.</p>
        </motion.div>

        {/* Company logos - Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="marquee-container" style={{ marginBottom: '16px' }}>
          <div className="marquee-track">
            {marqueeItems.map((comp, idx) => (
              <motion.div key={idx}
                whileHover={{ scale: 1.06, y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 24px',
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
                onClick={() => navigate('/companies')}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: comp.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '12px',
                  color: comp.color,
                  letterSpacing: '0.02em',
                  flexShrink: 0,
                  border: `1px solid ${comp.color}15`,
                }}>
                  {comp.logo}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap' }}>{comp.name}</span>
              </motion.div>
            ))}
            {/* +100 badge */}
            <motion.div
              animate={{ boxShadow: ['0 0 0 0 rgba(99,102,241,0.25)', '0 0 0 10px rgba(99,102,241,0)', '0 0 0 0 rgba(99,102,241,0.25)'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '16px',
                flexShrink: 0,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/companies')}>
              <span style={{ fontSize: '20px', fontWeight: 900, color: 'white' }}>+100</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>doanh nghiệp</span>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: '40px' }}>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 12px 24px rgba(99,102,241,0.2)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/companies')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '13px 28px',
              borderRadius: '14px',
              background: 'transparent',
              color: '#4f46e5',
              fontWeight: 700,
              fontSize: '14px',
              border: '2px solid #c7d2fe',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#4f46e5';
              e.currentTarget.style.borderColor = '#c7d2fe';
            }}>
            Khám phá tất cả các doanh nghiệp đối tác
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default CompaniesSection;
