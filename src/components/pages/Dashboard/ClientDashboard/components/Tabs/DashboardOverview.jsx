import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';

// Static services configuration containing icons and styling selectors
const servicesData = [
  {
    key: 'Job Application',
    title: 'Job Supporting',
    description: 'Streamline your hiring process with our job application tracking system.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
        <path d="M16 2a4 4 0 0 0-4 4v1h-2v-1a4 4 0 0 0-4-4"></path>
      </svg>
    ),
    iconClass: 'job-app-icon',
  },
  {
    key: 'Mobile Development',
    title: 'Mobile Development',
    description: 'Track project progress, bug reports, and user engagement for your mobile applications.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <path d="M12 18h.01"></path>
      </svg>
    ),
    iconClass: 'mobile-app-icon',
  },
  {
    key: 'Web Development',
    title: 'Web Development',
    description: 'Monitor website uptime, user engagement, and feature deployment for your web projects.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M2 12h20"></path>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    iconClass: 'web-app-icon',
  },
  {
    key: 'Digital Marketing',
    title: 'Digital Marketing',
    description: 'Analyze campaign performance, conversion rates, and social media reach.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0z"></path>
        <path d="M12 8l4 4-4 4V8z"></path>
        <path d="M12 8l-4 4 4 4-4-4z"></path>
      </svg>
    ),
    iconClass: 'digital-marketing-icon',
  },
  {
    key: 'IT Talent Supply',
    title: 'IT Talent Supply',
    description: 'Manage talent placement, skill matching, and client satisfaction metrics.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    iconClass: 'it-talent-icon',
  },
  {
    key: 'Cyber Security',
    title: 'Cyber Security',
    description: 'View security health scores, threat detection rates, and compliance status.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    iconClass: 'cybersecurity-icon',
  }
];

const DashboardOverview = ({
  clientUserName,
  activeBannerAds = [],
  activeServices = [],
  getServiceMetrics,
  handleViewDashboardClick
}) => {
  const [hoveredServiceKey, setHoveredServiceKey] = useState(null);

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }} className="brand-full">
        Welcome, {clientUserName}
      </h1>

      <div className="dashboard-content-wrapper">
        {/* --- START CAROUSEL SECTION --- */}
        <div className="carousel-wrapper" style={{ maxWidth: '1200px', margin: '0 auto 20px auto', padding: '0 20px' }}>
          <Carousel
            className="client-dashboard-carousel"
            interval={5000}
            indicators={true}
            controls={activeBannerAds.length > 0}
          >
            {activeBannerAds.length > 0 ? (
              // 1. SHOW DYNAMIC ADS FROM ADMIN (SPLIT LAYOUT)
              activeBannerAds.map((ad) => (
                <Carousel.Item key={ad.id} onClick={() => ad.linkUrl ? window.open(ad.linkUrl, '_blank') : null} style={{ cursor: ad.linkUrl ? 'pointer' : 'default' }}>
                  {/* Main Container: Flexbox for 50/50 split */}
                  <div style={{ height: '320px', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', display: 'flex', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    {/* LEFT HALF: IMAGE (50%) */}
                    <div style={{ width: '50%', position: 'relative', overflow: 'hidden' }}>
                      {ad.imageUrl ? (
                        <img src={ad.imageUrl} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '3rem', opacity: 0.3 }}>📢</span>
                        </div>
                      )}
                    </div>

                    {/* RIGHT HALF: CONTENT (50%) */}
                    <div style={{
                      width: '50%',
                      padding: '40px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      backgroundColor: '#fff'
                    }}>
                      {/* Optional Badge */}
                      <span style={{
                        background: '#e0f2fe', color: '#0284c7', padding: '4px 12px', borderRadius: '20px',
                        fontSize: '0.75rem', fontWeight: '700', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.5px'
                      }}>
                        Announcement
                      </span>

                      <h3 style={{ color: '#1e293b', fontWeight: '800', marginBottom: '12px', fontSize: '1.8rem', lineHeight: '1.2' }}>
                        {ad.title}
                      </h3>

                      <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '20px', lineHeight: '1.6', maxWidth: '95%' }}>
                        {ad.message}
                      </p>

                      {ad.linkUrl && (
                        <button style={{
                          background: '#3b82f6', border: 'none', color: 'white', padding: '12px 28px',
                          borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
                          marginTop: '5px'
                        }}>
                          {ad.buttonText || 'Learn More'}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </Carousel.Item>
              ))
            ) : (
              // 2. FALLBACK: SHOW DEFAULT CONTENT IF NO ADS
              <Carousel.Item>
                <div style={{ height: '320px', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', display: 'flex', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: '50%', position: 'relative' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '4rem', opacity: 0.3 }}>👋</span>
                    </div>
                  </div>
                  <div style={{
                    width: '50%',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                  }}>
                    <h3 style={{ color: '#1e293b', fontWeight: '800', marginBottom: '15px', fontSize: '2rem' }}>Welcome to Zethon Tech</h3>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '20px' }}>Manage your services, track applications, and grow your business with our comprehensive dashboard.</p>
                  </div>
                </div>
              </Carousel.Item>
            )}
          </Carousel>
        </div>
        {/* --- END CAROUSEL SECTION --- */}

        {/* 1. All Services Grid */}
        <div className="all-services-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 0' }}>
          {/* Header Design */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(90deg, #e0f2fe 0%, #f3e8ff 100%)',
              color: '#4f46e5',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
              Premium Services
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }}></div>
            </div>

            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '10px',
                background: 'linear-gradient(90deg, #1e293b 0%, #6d28d9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                MozBackgroundClip: 'text',
                MozTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              All Services
            </h2>

            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              marginBottom: '40px',
              lineHeight: 1.6,
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Explore our comprehensive suite of technology services designed to accelerate your business growth and transform your digital presence.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="services-grid-new">
            {servicesData.map((service, index) => {
              const isActive = activeServices.some(active => active.title === service.title);
              const colorMap = ['var(--color-blue)', 'var(--color-red)', 'var(--color-cyan)', 'var(--color-orange)', 'var(--color-green)', 'var(--color-purple)'];
              const cardColorVar = colorMap[index % colorMap.length];
              const serviceMetrics = getServiceMetrics(service.key);
              const isHovered = hoveredServiceKey === service.key;

              return (
                <div
                  key={service.key}
                  className={`service-card-new ${isActive ? 'active-service' : 'inactive-service'}`}
                  style={{
                    '--card-accent-color': cardColorVar,
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                  }}
                  onMouseEnter={() => setHoveredServiceKey(service.key)}
                  onMouseLeave={() => setHoveredServiceKey(null)}
                >
                  {/* Icon Container */}
                  <div className={`card-icon-container-new ${service.iconClass}`} style={{
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s ease'
                  }}>
                    {service.icon}
                  </div>

                  {/* Service Title */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
                    {service.title}
                  </h3>

                  {/* Conditional Content Based on Hover State */}
                  {isHovered ? (
                    <div>
                      {/* Description */}
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', minHeight: '60px', flexGrow: 1 }}>
                        {service.description}
                      </p>

                      {/* Metrics Grid */}
                      <div
                        className={`metrics-grid ${isHovered ? 'metrics-visible' : 'metrics-hidden'}`}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '15px',
                          marginTop: '15px',
                          width: '100%',
                          opacity: isHovered ? 1 : 0,
                          transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                          transition: 'opacity 0.3s ease, transform 0.3s ease'
                        }}
                      >
                        {service.key === 'Job Application' && serviceMetrics && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#60A5FA' }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.appliedToday}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Applied Today</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.totalApplications}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Applications</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.interviewsScheduled}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Interviews Scheduled</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#93C5FD' }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.responseRate}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Response Rate</div>
                            </div>
                          </>
                        )}

                        {service.key === 'Mobile Development' && serviceMetrics && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[0] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.activeProjects}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Projects</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[1] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.appsDeployed}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Apps Deployed</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[2] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.clientsSatisfied}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Clients Satisfied</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[3] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.avgRating}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Avg Rating</div>
                            </div>
                          </>
                        )}

                        {service.key === 'Web Development' && serviceMetrics && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[0] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.sitesBuilt}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sites Built</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[1] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.domainsManaged}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Domains Managed</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[2] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.uptime}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Uptime</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[3] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.performanceScore}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Performance Score</div>
                            </div>
                          </>
                        )}

                        {service.key === 'Digital Marketing' && serviceMetrics && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[0] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.activeCampaigns}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Campaigns</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[1] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.leadsGenerated}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Leads Generated</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[2] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.conversionRate}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Conversion Rate</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[3] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.roi}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ROI</div>
                            </div>
                          </>
                        )}

                        {service.key === 'IT Talent Supply' && serviceMetrics && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[0] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.candidatesPlaced}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Candidates Placed</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[1] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.interviewsToday}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Interviews Today</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[2] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.activePositions}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Positions</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[3] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.placementRate}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Placement Rate</div>
                            </div>
                          </>
                        )}

                        {service.key === 'Cyber Security' && serviceMetrics && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[0] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.threatsBlocked}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Threats Blocked</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[1] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.securityScans}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Security Scans</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[2] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.vulnerabilitiesFixed}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Vulnerabilities Fixed</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: serviceMetrics.colors[3] }} />
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {serviceMetrics.systemsProtected}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Systems Protected</div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Keep the button visible on hover */}
                      {isActive ? (
                        <button
                          className="dashboard-btn-new"
                          onClick={() => handleViewDashboardClick(service.title)}
                          style={{
                            marginTop: '15px',
                            padding: '10px 15px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            alignSelf: 'flex-start',
                          }}
                        >
                          View Dashboard →
                        </button>
                      ) : (
                        <button
                          className="book-now-btn-new"
                          onClick={() => handleViewDashboardClick(service.title)}
                          style={{
                            marginTop: '15px',
                            padding: '10px 15px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s, color 0.2s',
                            alignSelf: 'flex-start',
                          }}
                        >
                          Book Now
                        </button>
                      )}

                      {/* Add "Active" and "Featured" Badges (visible only on hover) */}
                      <div
                        className={`badge-container ${isHovered ? 'badges-visible' : 'badges-hidden'}`}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          display: 'flex',
                          gap: '8px',
                          zIndex: 1,
                          opacity: isHovered ? 1 : 0,
                          transform: isHovered ? 'translateY(0)' : 'translateY(-10px)',
                          transition: 'opacity 0.3s ease, transform 0.3s ease'
                        }}
                      >
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            color: '#3b82f6',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}
                        >
                          Active
                        </div>
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            color: '#6d28d9',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}
                        >
                          Featured
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Default State (Not Hovered)
                    <div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', minHeight: '60px', flexGrow: 1 }}>
                        {service.description}
                      </p>
                      {isActive ? (
                        <button
                          className="dashboard-btn-new"
                          onClick={() => handleViewDashboardClick(service.title)}
                          style={{
                            marginTop: '15px',
                            padding: '10px 15px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            alignSelf: 'flex-start',
                          }}
                        >
                          View Dashboard →
                        </button>
                      ) : (
                        <button
                          className="book-now-btn-new"
                          onClick={() => handleViewDashboardClick(service.title)}
                          style={{
                            marginTop: '15px',
                            padding: '10px 15px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s, color 0.2s',
                            alignSelf: 'flex-start',
                          }}
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Responsive Custom Pricing Banner --- */}
        <div
          className="custom-pricing-banner"
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "60px auto 0 auto",
            borderRadius: "20px",
            boxShadow: "0 12px 40px 0 rgba(30,44,76,0.17)",
            background: "linear-gradient(90deg, #1a2240 0%, #283366 100%)",
            overflow: "hidden",
            color: "#fff",
            fontSize: "1rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", minHeight: "300px" }}>
            {/* Left Column - Text Content */}
            <div
              style={{
                flex: "1 1 500px",
                background: "rgba(20,30,54,0.94)",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderTopLeftRadius: "20px",
                borderBottomLeftRadius: "20px",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(90deg,#fbbf24 50%,#38bdf8 100%)",
                  borderRadius: "20px",
                  color: "#232142",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  width: "fit-content",
                  marginBottom: "16px",
                  padding: "5px 16px",
                  letterSpacing: "-0.5px",
                }}
              >
                Limited Time Offer
              </div>
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                  color: "#fff",
                  lineHeight: 1.3,
                }}
              >
                Get <span style={{ color: "#fbbf24" }}>Custom Pricing</span> For Your Business
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#dbeafe",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                  maxWidth: "500px",
                }}
              >
                Join thousands of professionals who trust Zethon.<br />
                Connect with our team to discuss tailored solutions and competitive pricing for your specific needs.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "20px",
                }}
              >
                <button
                  onClick={() => { /* handle quote click */ }}
                  style={{
                    padding: "12px 28px",
                    border: "none",
                    borderRadius: "8px",
                    background: "linear-gradient(90deg,#fbbf24 0,#3b82f6 100%)",
                    color: "#232142",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(59,130,246,0.2)",
                    transition: "opacity 0.2s",
                  }}
                >
                  Get Quote
                </button>
                <span
                  style={{
                    color: "#10b981",
                    background: "rgba(16,185,129,0.08)",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                >
                  Free consultation available
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#93c5fd",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                {[
                  "• Free consultation included",
                  "• 24/7 expert support",
                  "• Scalable architecture",
                  "• Custom pricing available"
                ].map((item, i) => (
                  <span key={i}>{item}</span>
                ))}
              </div>
            </div>

            {/* Right Column - Service Grid */}
            <div
              style={{
                flex: "1 1 500px",
                background: "rgba(32,52,105,0.91)",
                padding: "30px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                alignContent: "center",
                borderTopRightRadius: "20px",
                borderBottomRightRadius: "20px",
              }}
            >
              {[
                { label: "Mobile Dev", tags: ["iOS & Android"], badgeColor: "#fbbf24" },
                { label: "Web Dev", tags: ["Full Stack"], badgeColor: "#38bdf8" },
                { label: "Marketing", tags: ["Digital Campaigns"], badgeColor: "#fb923c" },
                { label: "Security", tags: ["Enterprise Level"], badgeColor: "#64748b" }
              ].map(({ label, tags, badgeColor }, idx) => (
                <div
                  key={label}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                    {label}
                    <span
                      style={{
                        background: `${badgeColor}`,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "#fff",
                        borderRadius: "6px",
                        padding: "3px 8px",
                        marginLeft: "8px",
                      }}
                    >
                      Available
                    </span>
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>{tags.join(", ")}</div>
                  <button
                    style={{
                      marginTop: "auto",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      background: "rgba(255,255,255,0.12)",
                      color: "#fff",
                      border: "none",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onClick={() => { /* handle pricing click */ }}
                  >
                    Contact for pricing
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* --- END Custom Pricing Banner --- */}
      </div>
    </div>
  );
};

export default DashboardOverview;
