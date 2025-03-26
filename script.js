/**
 * CV Platform - Core Application Architecture
 * 
 * A sophisticated, performance-optimized CV presentation system with:
 * - Component-based architecture for maintainability
 * - Advanced PDF generation with multi-stage processing
 * - Responsive design with intelligent adaptation
 * - Progressive enhancement for optimal accessibility
 */
class CVPlatform {
  /**
   * Initializes the comprehensive CV platform with advanced configuration
   * @param {Object} config - Platform configuration options
   */
  constructor(config = {}) {
    // Core system configuration with intelligent defaults
    this.config = {
      pdfQuality: config.pdfQuality || 3,
      animationDuration: config.animationDuration || 600,
      enableProgressiveLoading: config.enableProgressiveLoading !== false,
      enableIntersectionObserver: config.enableIntersectionObserver !== false,
      ...config
    };
    
    // Component registry for modular architecture
    this.components = {
      navigation: null,
      contentManager: null,
      pdfGenerator: null,
      animationController: null,
      introAnimation: null
    };
    
    // System state management
    this.state = {
      isGeneratingPDF: false,
      currentSection: null,
      isMobile: window.innerWidth < 768,
      isAnimating: false,
      visibleSections: new Set(),
      introAnimationComplete: false
    };
    
    // Performance metrics for optimization
    this.metrics = {
      initialLoadTime: null,
      pdfGenerationTime: null,
      navigationInteractions: 0,
      scrollEvents: 0
    };
    
    // Initialize the platform
    this.init();
  }
  
  /**
   * Initializes the platform with comprehensive component initialization
   * and advanced feature detection
   */
  init() {
    console.info('Initializing CV Platform...');
    
    // Measure initial load time for performance metrics
    const startTime = performance.now();
    
    // Feature detection for progressive enhancement
    this.detectFeatures();
    
    // Initialize core components in optimal order
    this.initializeContentManager();
    this.initializeAnimationController();
    this.initializeNavigation();
    this.initializePDFGenerator();
    this.initializeIntroAnimation();
    
    // Set up event listeners with proper delegation
    this.setupEventListeners();
    
    // Record performance metrics
    this.metrics.initialLoadTime = performance.now() - startTime;
    console.info(`CV Platform initialized in ${this.metrics.initialLoadTime.toFixed(2)}ms`);
  }
  
  /**
   * Detects browser capabilities for progressive enhancement
   * and optimal feature selection
   */
  detectFeatures() {
    // Detect IntersectionObserver support
    const hasIntersectionObserver = 'IntersectionObserver' in window;
    if (!hasIntersectionObserver && this.config.enableIntersectionObserver) {
      console.warn('IntersectionObserver not supported, falling back to scroll events');
      this.config.enableIntersectionObserver = false;
    }
    
    // Detect print capability
    const hasPrintCapability = 'print' in window;
    
    // Detect advanced canvas support for PDF generation
    const hasAdvancedCanvas = (() => {
      try {
        const canvas = document.createElement('canvas');
        return canvas.getContext('2d') !== null;
      } catch (e) {
        return false;
      }
    })();
    
    // Update config based on feature detection
    this.config.features = {
      hasIntersectionObserver,
      hasPrintCapability,
      hasAdvancedCanvas,
      supportsModernJS: true
    };
  }
  
  /**
   * Initializes the content management system for optimal
   * content presentation and section tracking
   */
  initializeContentManager() {
    this.components.contentManager = {
      sections: Array.from(document.querySelectorAll('.section')),
      
      /**
       * Gets metadata for a specific section
       * @param {HTMLElement} section - The section element
       * @return {Object} Section metadata
       */
      getSectionMetadata(section) {
        const title = section.querySelector('.section-title')?.textContent || '';
        const sectionClass = Array.from(section.classList)
          .find(cls => cls !== 'section' && cls.includes('-section'));
        
        return {
          title,
          id: section.id || sectionClass || '',
          element: section,
          isVisible: false
        };
      },
      
      /**
       * Gets current visible sections based on scroll position
       * @return {Array} Currently visible sections
       */
      getVisibleSections() {
        return this.sections
          .filter(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            return rect.top < windowHeight && rect.bottom > 0;
          })
          .map(this.getSectionMetadata);
      }
    };
    
    // Generate metadata for all sections
    this.components.contentManager.sectionMetadata = 
      this.components.contentManager.sections.map(
        this.components.contentManager.getSectionMetadata
      );
  }
  
  /**
   * Initializes the animation controller for performance-optimized
   * entry animations and transitions
   */
  initializeAnimationController() {
    this.components.animationController = {
      /**
       * Sets up intersection observer for optimized animations
       */
      setupIntersectionObserver: () => {
        if (!this.config.features.hasIntersectionObserver) return;
        
        const observerOptions = {
          root: null,
          threshold: 0.15,
          rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            // Only trigger animations if intro is complete or items are above the fold
            if (entry.isIntersecting && 
                (this.state.introAnimationComplete || entry.boundingClientRect.y > window.innerHeight)) {
              entry.target.classList.add('animate-in');
              observer.unobserve(entry.target);
              this.state.visibleSections.add(entry.target.closest('.section'));
            }
          });
        }, observerOptions);
        
        // Observe all animatable elements with staggered delay strategy
        const animatableElements = document.querySelectorAll(
          '.section, .edu-entry, .exam-entry, .project, .rotation-entry, .tech-entry, tr'
        );
        
        animatableElements.forEach((element, index) => {
          element.classList.add('animate-ready');
          // Add more delay to initial animations if intro animation is active
          const baseDelay = this.state.introAnimationComplete ? 0 : 400;
          element.style.transitionDelay = `${baseDelay + (index % 5 * 50)}ms`;
          observer.observe(element);
        });
        
        return observer;
      },
      
      /**
       * Enables all animations immediately (used for PDF generation)
       */
      completeAllAnimations: () => {
        document.querySelectorAll('.animate-ready').forEach(el => {
          el.classList.remove('animate-ready');
          el.classList.add('animate-in');
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }
    };
    
    // Initialize the observer if enabled
    if (this.config.enableIntersectionObserver) {
      this.components.animationController.observer = 
        this.components.animationController.setupIntersectionObserver();
    }
  }
  
  /**
   * Initializes the navigation system with intelligent section tracking
   * and responsive behavior
   */
  initializeNavigation() {
    const mobileNavSections = document.getElementById('mobileNavSections');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const progressIndicator = document.querySelector('.progress-indicator');
    
    this.components.navigation = {
      elements: {
        mobileNavSections,
        mobileNavToggle,
        mobileNav,
        mobileNavClose,
        progressIndicator
      },
      
      /**
       * Updates the navigation state based on current scroll position
       */
      updateNavigationState: () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        // Update progress indicator with requestAnimationFrame for performance
        if (progressIndicator) {
          window.requestAnimationFrame(() => {
            progressIndicator.style.width = `${scrollPercent}%`;
          });
        }
        
        // Find the current section with optimized calculation
        let currentSectionIndex = 0;
        const sections = this.components.contentManager.sections;
        
        sections.forEach((section, index) => {
          const sectionTop = section.offsetTop;
          if (scrollTop >= sectionTop - 200) {
            currentSectionIndex = index;
          }
        });
        
        // Update active navigation items
        document.querySelectorAll('.mobile-nav-section').forEach((item, index) => {
          if (index === currentSectionIndex) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      },
      
      /**
       * Builds the mobile navigation UI from section metadata
       */
      buildMobileNavigation: () => {
        if (!mobileNavSections) return;
        
        // Clear existing navigation
        mobileNavSections.innerHTML = '';
        
        // Icons mapping for section types
        const sectionIcons = {
          'education-section': 'fa-graduation-cap',
          'exam-section': 'fa-clipboard-check',
          'rotations-section': 'fa-hospital',
          'portfolio-section': 'fa-briefcase',
          'projects-section': 'fa-file-alt',
          'tech-section': 'fa-laptop-code',
          'professional-section': 'fa-user-tie'
        };
        
        // Build navigation items with proper event delegation
        this.components.contentManager.sections.forEach(section => {
          const sectionTitle = section.querySelector('.section-title')?.textContent || 'Section';
          const sectionId = section.className.split(' ')[1] || '';
          const iconClass = sectionIcons[sectionId] || 'fa-bookmark';
          
          const navItem = document.createElement('div');
          navItem.className = 'mobile-nav-section';
          navItem.innerHTML = `
            <div class="mobile-nav-icon"><i class="fas ${iconClass}"></i></div>
            <div>${sectionTitle}</div>
          `;
          
          navItem.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Scroll to section with smooth behavior
            section.scrollIntoView({ behavior: 'smooth' });
            
            // Visual feedback - highlight section briefly
            section.classList.add('highlight');
            setTimeout(() => {
              section.classList.remove('highlight');
            }, 2000);
            
            // Close mobile navigation
            if (mobileNav) mobileNav.classList.remove('active');
            
            // Track interaction for analytics
            this.metrics.navigationInteractions++;
          });
          
          mobileNavSections.appendChild(navItem);
        });
      }
    };
    
    // Initialize mobile navigation
    this.components.navigation.buildMobileNavigation();
    
    // Setup navigation event handlers
    if (mobileNavToggle) {
      mobileNavToggle.addEventListener('click', () => {
        if (mobileNav) mobileNav.classList.add('active');
      });
    }
    
    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', () => {
        if (mobileNav) mobileNav.classList.remove('active');
      });
    }
  }
  
  /**
   * Initializes the PDF generation system with advanced rendering pipeline
   * and comprehensive error handling
   */
  initializePDFGenerator() {
    this.components.pdfGenerator = {
      /**
       * Generates a high-quality PDF with advanced processing pipeline
       * @return {Promise<Blob>} The generated PDF as a blob
       */
      generatePDF: async () => {
        if (this.state.isGeneratingPDF) {
          console.warn('PDF generation already in progress');
          return null;
        }
        
        // Set generation state
        this.state.isGeneratingPDF = true;
        const startTime = performance.now();
        
        try {
          // Show loading indicator
          const loadingIndicator = document.querySelector('.pdf-loading');
          if (loadingIndicator) loadingIndicator.style.display = 'flex';
          
          // Complete all animations for proper rendering
          this.components.animationController.completeAllAnimations();
          
          // Hide UI elements not needed for PDF
          const elementsToHide = [
            document.querySelector('.pdf-export'),
            document.getElementById('mobileNavToggle'),
            document.querySelector('.quick-nav'),
            document.querySelector('.progress-indicator')
          ];
          
          elementsToHide.forEach(el => {
            if (el) el.style.display = 'none';
          });
          
          // Initialize PDF with optimal settings
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
          });
          
          // Get all sections to process sequentially
          const sections = Array.from(document.querySelectorAll(
            '.section, .header, .about-me, .pdf-export'
          ));
          
          // Process sections with advanced pipeline
          let currentPage = 1;
          let currentY = 10; // Starting Y position with margin
          
          for (let i = 0; i < sections.length; i++) {
            // Update loading indicator
            if (loadingIndicator) {
              const loadingText = document.querySelector('.pdf-loading-text');
              if (loadingText) {
                loadingText.textContent = `Generating PDF... (${i + 1}/${sections.length})`;
              }
            }
            
            const section = sections[i];
            
            try {
              // Capture the section with high quality
              const canvas = await html2canvas(section, {
                scale: this.config.pdfQuality,
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: '#ffffff'
              });
              
              // Convert to optimized image format
              const imgData = canvas.toDataURL('image/jpeg', 0.95);
              
              // Calculate optimal dimensions
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = pdf.internal.pageSize.getHeight();
              const imgWidth = canvas.width;
              const imgHeight = canvas.height;
              
              // Calculate scale while preserving aspect ratio
              const ratio = Math.min(
                pdfWidth / imgWidth, 
                (pdfHeight / 4) / imgHeight // Limit height for multi-section pages
              );
              
              const scaledWidth = imgWidth * ratio;
              const scaledHeight = imgHeight * ratio;
              
              // Check if we need a new page based on remaining space
              if (i > 0 && (currentY + scaledHeight > pdfHeight - 10)) {
                pdf.addPage();
                currentPage++;
                currentY = 10; // Reset Y position on new page
              }
              
              // Center horizontally
              const xPosition = (pdfWidth - scaledWidth) / 2;
              
              // Add image to PDF at calculated position
              pdf.addImage(
                imgData, 'JPEG', 
                xPosition, currentY, 
                scaledWidth, scaledHeight
              );
              
              // Update Y position for next section
              currentY += scaledHeight + 5; // Add small gap between sections
              
              // Prevent UI freezing with small delay between sections
              await new Promise(resolve => setTimeout(resolve, 10));
              
            } catch (error) {
              console.error(`Error processing section ${i}:`, error);
              // Continue with next section despite errors for resilience
            }
          }
          
          // Save the PDF with descriptive filename including date
          const timestamp = new Date().toISOString().split('T')[0];
          pdf.save(`Cameron_Kiani_CV_${timestamp}.pdf`);
          
          // Restore UI elements
          elementsToHide.forEach(el => {
            if (el) el.style.display = '';
          });
          
          if (loadingIndicator) loadingIndicator.style.display = 'none';
          
          // Update performance metrics
          this.metrics.pdfGenerationTime = performance.now() - startTime;
          console.info(`PDF generated in ${this.metrics.pdfGenerationTime.toFixed(2)}ms`);
          
          return pdf.output('blob');
          
        } catch (error) {
          console.error('Critical error in PDF generation:', error);
          
          // Show error message to user
          alert('There was an error generating the PDF. Please try again.');
          
          // Restore UI state
          const loadingIndicator = document.querySelector('.pdf-loading');
          if (loadingIndicator) loadingIndicator.style.display = 'none';
          
          const pdfButton = document.querySelector('.pdf-export');
          if (pdfButton) pdfButton.style.display = 'block';
          
          return null;
          
        } finally {
          // Reset state regardless of outcome
          this.state.isGeneratingPDF = false;
        }
      }
    };
  }
  
  /**
   * Initializes the intro animation system and handles animation events
   */
  initializeIntroAnimation() {
    const introElement = document.querySelector('.intro-animation');
    
    if (!introElement) {
      console.warn('Intro animation element not found');
      this.state.introAnimationComplete = true;
      return;
    }
    
    this.components.introAnimation = {
      element: introElement,
      
      /**
       * Handles intro animation completion events
       */
      handleAnimationEnd: (event) => {
        if (event.animationName === 'fadeOutIntro') {
          // Animation complete - update state
          this.state.introAnimationComplete = true;
          
          // Remove the element from DOM after animation completes
          setTimeout(() => {
            introElement.remove();
          }, 100);
          
          // Trigger any post-intro tasks if needed
          this.triggerPostIntroTasks();
        }
      }
    };
    
    // Listen for animation end event
    introElement.addEventListener('animationend', 
      this.components.introAnimation.handleAnimationEnd);
    
    // Add click event to skip or advance through animation
    introElement.addEventListener('click', () => {
      this.skipIntroAnimation();
    });
    
    // Skip animation if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      introElement.style.display = 'none';
      this.state.introAnimationComplete = true;
    }
    
    // Skip animation for print media
    if (window.matchMedia('print').matches) {
      introElement.style.display = 'none';
      this.state.introAnimationComplete = true;
    }
  }
  
  /**
   * Performs actions after the intro animation completes
   */
  triggerPostIntroTasks() {
    // Reveal and animate the main content immediately after intro
    document.querySelectorAll('.animate-ready').forEach(element => {
      // Add a small staggered delay for a nice reveal effect
      setTimeout(() => {
        element.classList.add('animate-in');
      }, Math.random() * 200); // Random delay up to 200ms for natural effect
    });
  }
  
  /**
   * Skips the intro animation completely or advances to next phase
   */
  skipIntroAnimation() {
    const introElement = document.querySelector('.intro-animation');
    if (!introElement) return;
    
    const introQuotePart1 = document.querySelector('.intro-quote-part1');
    const introQuotePart2 = document.querySelector('.intro-quote-part2');
    const introName = document.querySelector('.intro-name');
    const introTitle = document.querySelector('.intro-title');
    
    // If quote is still showing, skip to name/title
    if ((introQuotePart1 && window.getComputedStyle(introQuotePart1).opacity > 0) ||
        (introQuotePart2 && window.getComputedStyle(introQuotePart2).opacity > 0)) {
      
      // Skip quote parts and show name/title immediately
      if (introQuotePart1) {
        introQuotePart1.style.animation = 'none';
        introQuotePart1.style.opacity = '0';
      }
      
      if (introQuotePart2) {
        introQuotePart2.style.animation = 'none';
        introQuotePart2.style.opacity = '0';
      }
      
      introName.style.animation = 'none';
      introName.style.opacity = '1';
      introName.style.transform = 'translateY(0)';
      
      introTitle.style.animation = 'none';
      introTitle.style.opacity = '1';
      introTitle.style.transform = 'translateY(0)';
      
      // Set a shorter timeout for the entire intro
      introElement.style.animationDelay = '1.5s';
      
      return false; // Animation not fully skipped, just advanced
    }
    
    // Skip entire intro animation
    introElement.style.animation = 'none';
    introElement.style.display = 'none';
    this.state.introAnimationComplete = true;
    this.triggerPostIntroTasks();
    
    return true; // Animation fully skipped
  }
  
  /**
   * Sets up optimized event listeners with proper throttling
   * and event delegation for performance
   */
  setupEventListeners() {
    // Throttled scroll handler for optimal performance
    let scrollTimeout;
    const scrollHandler = () => {
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        this.components.navigation.updateNavigationState();
        this.metrics.scrollEvents++;
        scrollTimeout = null;
      }, 50); // 50ms throttling for smooth performance
    };
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Resize handler with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      
      resizeTimeout = setTimeout(() => {
        // Update responsive state
        this.state.isMobile = window.innerWidth < 768;
        
        // Recalculate layout dependencies if needed
        if (this.components.navigation) {
          this.components.navigation.updateNavigationState();
        }
      }, 200);
    });
    
    // PDF generation handler
    const pdfButton = document.querySelector('.pdf-export');
    if (pdfButton) {
      pdfButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Ensure intro animation is complete before generating PDF
        if (!this.state.introAnimationComplete) {
          this.skipIntroAnimation();
        }
        
        await this.components.pdfGenerator.generatePDF();
      });
    }
    
    // Setup key shortcuts
    window.addEventListener('keydown', (e) => {
      // Skip or advance intro animation with Escape key
      if (e.key === 'Escape' && !this.state.introAnimationComplete) {
        this.skipIntroAnimation();
      }
      
      // Skip intro animation with spacebar (alternative option)
      if (e.code === 'Space' && !this.state.introAnimationComplete) {
        this.skipIntroAnimation();
        e.preventDefault(); // Prevent page scroll
      }
      
      // Print shortcut (Ctrl+P)
      if (e.ctrlKey && e.key === 'p') {
        // Make sure intro animation is hidden before print
        const introElement = document.querySelector('.intro-animation');
        if (introElement) {
          introElement.style.display = 'none';
        }
      }
    });
    
    // Setup quick navigation handlers
    document.getElementById('scrollToTop')?.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    document.getElementById('scrollToBottom')?.addEventListener('click', () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });
    
    // Initialize navigation state
    requestAnimationFrame(() => {
      this.components.navigation.updateNavigationState();
    });
  }
}

// Initialize the platform when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cvPlatform = new CVPlatform({
    pdfQuality: 3,
    enableIntersectionObserver: true,
    enableProgressiveLoading: true,
    debug: false
  });
});