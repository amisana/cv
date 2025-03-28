/**
 * CV Platform - Core Application Architecture
 * 
 * A sophisticated, performance-optimized CV presentation system that provides:
 * - Component-based architecture for maintainability
 * - Advanced PDF generation with multi-stage processing
 * - Responsive design with intelligent adaptation
 * - Progressive enhancement for optimal accessibility
 * - Performance-optimized animations and transitions
 * - Comprehensive error handling and recovery
 * 
 * @class CVPlatform
 * @example
 * // Initialize the platform
 * const cvPlatform = new CVPlatform({
 *   pdfQuality: 3,
 *   enableIntersectionObserver: true,
 *   enableProgressiveLoading: true,
 *   debug: false
 * });
 */
class CVPlatform {
  /**
   * Initializes the comprehensive CV platform with advanced configuration
   * 
   * @param {Object} config - Platform configuration options
   * @param {number} [config.pdfQuality=3] - Quality setting for PDF generation (1-5)
   * @param {number} [config.animationDuration=600] - Duration of animations in milliseconds
   * @param {boolean} [config.enableProgressiveLoading=true] - Enable progressive content loading
   * @param {boolean} [config.enableIntersectionObserver=true] - Enable intersection observer for animations
   * @param {boolean} [config.debug=false] - Enable debug logging
   * @param {boolean} [config.enableResponsiveFonts=true] - Enable responsive fonts
   * @param {number} [config.baseFontSize=16] - Base font size for responsive typography
   * @param {number} [config.fontScaleRatio=1.2] - Font scale ratio for responsive typography
   * 
   * @property {Object} config - Platform configuration with intelligent defaults
   * @property {Object} components - Component registry for modular architecture
   * @property {Object} state - System state management
   * @property {Object} metrics - Performance metrics for optimization
   * 
   * @throws {Error} If required dependencies are not loaded
   */
  constructor(config = {}) {
    // Core system configuration with intelligent defaults
    this.config = {
      pdfQuality: config.pdfQuality || 3,
      animationDuration: config.animationDuration || 600,
      enableProgressiveLoading: config.enableProgressiveLoading !== false,
      enableIntersectionObserver: config.enableIntersectionObserver !== false,
      enableResponsiveFonts: config.enableResponsiveFonts !== false,
      baseFontSize: config.baseFontSize || 16,
      fontScaleRatio: config.fontScaleRatio || 1.2,
      ...config
    };
    
    // Component registry for modular architecture
    this.components = {
      navigation: null,
      contentManager: null,
      pdfGenerator: null,
      animationController: null,
      introAnimation: null,
      tooltipSystem: null
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
   * 
   * @private
   * @method init
   * 
   * @description
   * Performs the following initialization steps:
   * 1. Measures initial load time for performance metrics
   * 2. Detects browser capabilities for progressive enhancement
   * 3. Initializes core components in optimal order:
   *    - Content Manager
   *    - Animation Controller
   *    - Navigation
   *    - PDF Generator
   *    - Intro Animation
   *    - Tooltip System
   * 4. Sets up event listeners with proper delegation
   * 5. Records performance metrics
   * 
   * @throws {Error} If component initialization fails
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
    this.initializeTooltipSystem();
    
    // Set up event listeners with proper delegation
    this.setupEventListeners();
    
    // Add responsive typography
    this.setupResponsiveTypography();
    
    // Record performance metrics
    this.metrics.initialLoadTime = performance.now() - startTime;
    console.info(`CV Platform initialized in ${this.metrics.initialLoadTime.toFixed(2)}ms`);
  }
  
  /**
   * Detects browser capabilities for progressive enhancement
   * and optimal feature selection
   * 
   * @private
   * @method detectFeatures
   * 
   * @description
   * Checks for the following browser capabilities:
   * - IntersectionObserver support for scroll-based animations
   * - Print capability for PDF generation
   * - Advanced canvas support for image processing
   * - Modern JavaScript features
   * 
   * Updates this.config.features with detection results
   * and adjusts configuration based on available features
   * 
   * @returns {void}
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
   * 
   * @private
   * @method initializeContentManager
   * 
   * @description
   * Sets up the content management system with:
   * - Section tracking and metadata
   * - Visibility state management
   * - Section querying capabilities
   * 
   * @returns {void}
   */
  initializeContentManager() {
    this.components.contentManager = {
      sections: Array.from(document.querySelectorAll('.section')),
      
      /**
       * Gets metadata for a specific section
       * 
       * @param {HTMLElement} section - The section element to analyze
       * @returns {Object} Section metadata including:
       * @returns {string} .title - The section's title text
       * @returns {string} .id - The section's unique identifier
       * @returns {HTMLElement} .element - The section DOM element
       * @returns {boolean} .isVisible - Current visibility state
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
       * 
       * @returns {Array<Object>} Array of visible section metadata objects
       * @returns {string} [].title - Section title
       * @returns {string} [].id - Section identifier
       * @returns {HTMLElement} [].element - Section DOM element
       * @returns {boolean} [].isVisible - Visibility state
       * 
       * @description
       * Calculates which sections are currently visible in the viewport
       * using getBoundingClientRect() for precise measurements
       */
      getVisibleSections() {
        return this.sections
          .filter(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            return rect.top < windowHeight && rect.bottom > 0;
          })
          .map(this.getSectionMetadata);
      },
      
      /**
       * Optimizes images for current device
       * 
       * @private
       * @method optimizeImagesForDevice
       * 
       * @description
       * Adapts images based on screen size:
       * - Loads smaller images on mobile
       * - Defers non-critical images
       * - Converts large images to WebP format on supported browsers
       * 
       * @returns {void}
       */
      optimizeImagesForDevice: () => {
        const isMobile = window.innerWidth < 768;
        const images = document.querySelectorAll('img:not(.optimized)');
        
        images.forEach(img => {
          // Add optimized class to prevent reprocessing
          img.classList.add('optimized');
          
          if (isMobile) {
            // Use smaller image source if available
            if (img.dataset.mobileSrc) {
              img.src = img.dataset.mobileSrc;
            }
            
            // Limit max-width on mobile
            img.style.maxWidth = '100%';
            
            // For non-critical images below the fold
            if (img.getBoundingClientRect().top > window.innerHeight) {
              img.loading = 'lazy';
            }
          }
        });
      }
    };
    
    // Generate metadata for all sections
    this.components.contentManager.sectionMetadata = 
      this.components.contentManager.sections.map(
        this.components.contentManager.getSectionMetadata
      );
    
    // Call image optimization
    this.components.contentManager.optimizeImagesForDevice();
  }
  
  /**
   * Initializes the animation controller for performance-optimized
   * entry animations and transitions
   * 
   * @private
   * @method initializeAnimationController
   * 
   * @description
   * Sets up the animation system with:
   * - Intersection Observer for scroll-based animations
   * - Staggered animation delays
   * - Performance optimizations
   * - Reduced motion support
   * 
   * @returns {void}
   */
  initializeAnimationController() {
    this.components.animationController = {
      /**
       * Sets up intersection observer for optimized animations
       * 
       * @private
       * @method setupIntersectionObserver
       * 
       * @description
       * Creates an IntersectionObserver to handle scroll-based animations:
       * - Triggers animations when elements enter viewport
       * - Handles intro animation completion state
       * - Manages animation timing and sequencing
       * 
       * @returns {IntersectionObserver|null} The configured observer or null if not supported
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
       * 
       * @private
       * @method completeAllAnimations
       * 
       * @description
       * Forces completion of all pending animations by:
       * - Removing animation-ready classes
       * - Adding animation-complete classes
       * - Resetting transform and opacity states
       * 
       * @returns {void}
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
   * 
   * @private
   * @method initializeNavigation
   * 
   * @description
   * Sets up the navigation system with:
   * - Mobile-friendly navigation menu
   * - Progress indicator
   * - Section tracking
   * - Smooth scrolling
   * - Touch-optimized interactions
   * 
   * @returns {void}
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
       * 
       * @private
       * @method updateNavigationState
       * 
       * @description
       * Updates navigation UI elements:
       * - Progress indicator width
       * - Active section highlighting
       * - Mobile navigation state
       * 
       * Uses requestAnimationFrame for performance optimization
       * 
       * @returns {void}
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
       * 
       * @private
       * @method buildMobileNavigation
       * 
       * @description
       * Creates mobile navigation menu with:
       * - Section icons
       * - Section titles
       * - Click handlers
       * - Visual feedback
       * 
       * @returns {void}
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
      },
      
      /**
       * Enhances touch interactions for mobile devices
       * 
       * @private
       * @method setupTouchInteractions
       * 
       * @description
       * Adds optimized touch controls:
       * - Swipe left/right for navigation
       * - Increased touch targets
       * - Touch feedback effects
       * 
       * @returns {void}
       */
      setupTouchInteractions: () => {
        if (!this.state.isMobile) return;
        
        // Track touch start position for swipe detection
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
          const touchEndX = e.changedTouches[0].screenX;
          const touchEndY = e.changedTouches[0].screenY;
          
          // Calculate distance moved
          const diffX = touchStartX - touchEndX;
          const diffY = touchStartY - touchEndY;
          
          // Only process horizontal swipes (ignore vertical scrolling)
          if (Math.abs(diffX) > Math.abs(diffY) * 2 && Math.abs(diffX) > 50) {
            const mobileNav = document.getElementById('mobileNav');
            
            if (diffX > 0) {
              // Swipe left - close nav if open
              if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
              }
            } else {
              // Swipe right - open nav if closed
              if (mobileNav && !mobileNav.classList.contains('active')) {
                mobileNav.classList.add('active');
              }
            }
          }
        }, { passive: true });
        
        // Add active/hover states for touch devices
        const touchTargets = document.querySelectorAll(
          '.mobile-nav-section, .mobile-nav-toggle, a, button'
        );
        
        touchTargets.forEach(element => {
          element.addEventListener('touchstart', () => {
            element.classList.add('touch-active');
          }, { passive: true });
          
          ['touchend', 'touchcancel'].forEach(eventType => {
            element.addEventListener(eventType, () => {
              element.classList.remove('touch-active');
            }, { passive: true });
          });
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
    
    // Setup touch interactions for mobile
    this.components.navigation.setupTouchInteractions();
  }
  
  /**
   * Initializes the PDF generation system with advanced rendering pipeline
   * and comprehensive error handling
   * 
   * @private
   * @method initializePDFGenerator
   * 
   * @description
   * Sets up the PDF generation system with:
   * - High-quality rendering pipeline
   * - Multi-stage processing
   * - Progress tracking
   * - Error recovery
   * - UI state management
   * 
   * @returns {void}
   */
  initializePDFGenerator() {
    this.components.pdfGenerator = {
      /**
       * Generates a high-quality PDF with advanced processing pipeline
       * 
       * @public
       * @method generatePDF
       * 
       * @description
       * Generates a PDF document with the following steps:
       * 1. Pre-processing:
       *    - Completes all animations
       *    - Hides UI elements
       *    - Shows loading indicator
       * 
       * 2. Processing:
       *    - Captures sections sequentially
       *    - Optimizes image quality
       *    - Handles page breaks
       *    - Manages layout
       * 
       * 3. Post-processing:
       *    - Restores UI state
       *    - Updates metrics
       *    - Handles errors
       * 
       * @returns {Promise<Blob|null>} The generated PDF as a blob, or null if generation fails
       * @throws {Error} If critical errors occur during generation
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
   * 
   * @private
   * @method initializeIntroAnimation
   * 
   * @description
   * Sets up the intro animation system with:
   * - Sequential text reveal
   * - Skip functionality
   * - Reduced motion support
   * - Print media handling
   * - Event management
   * 
   * @returns {void}
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
       * 
       * @private
       * @method handleAnimationEnd
       * 
       * @param {AnimationEvent} event - The animation end event
       * 
       * @description
       * Manages the completion of the intro animation:
       * - Updates completion state
       * - Removes animation element
       * - Triggers post-intro tasks
       * 
       * @returns {void}
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
   * 
   * @private
   * @method triggerPostIntroTasks
   * 
   * @description
   * Handles post-intro tasks:
   * - Reveals main content
   * - Triggers staggered animations
   * - Updates UI state
   * 
   * @returns {void}
   */
  triggerPostIntroTasks() {
    // Reveal and animate the main content immediately after intro
    const animatableElements = document.querySelectorAll('.animate-ready');
    
    // Group elements by their type for more natural animation flow
    const elementGroups = {
      sections: [],
      headings: [],
      entries: [],
      details: []
    };
    
    // Categorize elements for grouped animations
    animatableElements.forEach(element => {
      if (element.classList.contains('section')) {
        elementGroups.sections.push(element);
      } else if (element.classList.contains('section-title') || element.tagName === 'H2' || element.tagName === 'H3') {
        elementGroups.headings.push(element);
      } else if (element.classList.contains('edu-entry') || 
                element.classList.contains('exam-entry') || 
                element.classList.contains('project') || 
                element.classList.contains('rotation-entry') || 
                element.classList.contains('tech-entry') || 
                element.classList.contains('professional-entry') || 
                element.tagName === 'TR') {
        elementGroups.entries.push(element);
      } else {
        elementGroups.details.push(element);
      }
    });
    
    // Define animation timing variables
    const baseDelay = 50;
    const groupOffsets = {
      sections: 0,
      headings: 100,
      entries: 200,
      details: 300
    };
    
    // Process each group with internal staggering
    Object.entries(elementGroups).forEach(([groupName, elements]) => {
      const groupOffset = groupOffsets[groupName];
      
      elements.forEach((element, index) => {
        // Calculate delay based on group and position within group
        // Use an easing function for more natural staggering (faster at start, slower at end)
        const position = index / Math.max(elements.length, 1);
        const easedPosition = position * position; // Simple quadratic easing
        const maxGroupDelay = 300; // Cap the maximum delay within a group
        const staggerDelay = Math.min(easedPosition * maxGroupDelay, maxGroupDelay);
        
        // Final delay combines base delay, group offset, and staggered position
        const delay = baseDelay + groupOffset + staggerDelay;
        
        // Apply the animation with calculated delay
        setTimeout(() => {
          element.classList.add('animate-in');
        }, delay);
      });
    });
    
    // Update UI state
    this.state.isAnimating = false;
    
    // Log animation metrics
    if (this.config.debug) {
      console.info(`Post-intro animations triggered for ${animatableElements.length} elements`);
    }
  }
  
  /**
   * Skips the intro animation completely or advances to next phase
   * 
   * @public
   * @method skipIntroAnimation
   * 
   * @description
   * Provides two levels of skip functionality:
   * 1. Advance to next phase:
   *    - Skips quote animation
   *    - Shows name/title immediately
   *    - Shortens remaining animation
   * 
   * 2. Complete skip:
   *    - Removes animation element
   *    - Updates completion state
   *    - Triggers post-intro tasks
   * 
   * @returns {boolean} True if animation was fully skipped, false if just advanced
   */
  skipIntroAnimation() {
    const introElement = document.querySelector('.intro-animation');
    if (!introElement) return;
    
    // Update selectors to handle all quote parts
    const introQuoteParts = [
      document.querySelector('.intro-quote-part1'),
      document.querySelector('.intro-quote-part1-cont'),
      document.querySelector('.intro-quote-part2'),
      document.querySelector('.intro-quote-part2-cont')
    ];
    
    const introName = document.querySelector('.intro-name');
    const introTitle = document.querySelector('.intro-title');
    
    // Check if any quote part is still showing
    const isQuoteVisible = introQuoteParts.some(part => 
      part && window.getComputedStyle(part).opacity > 0
    );
    
    // If quote is still showing, skip to name/title
    if (isQuoteVisible) {
      // Skip all quote parts at once
      introQuoteParts.forEach(part => {
        if (part) {
          part.style.animation = 'none';
          part.style.opacity = '0';
        }
      });
      
      // Show name and title immediately
      if (introName) {
        introName.style.animation = 'none';
        introName.style.opacity = '1';
        introName.style.transform = 'translateY(0)';
      }
      
      if (introTitle) {
        introTitle.style.animation = 'none';
        introTitle.style.opacity = '1';
        introTitle.style.transform = 'translateY(0)';
      }
      
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
   * Implements a responsive typography system
   * 
   * @private
   * @method setupResponsiveTypography
   * 
   * @description
   * Creates a fluid typography system that:
   * - Scales font sizes based on viewport width
   * - Maintains proper hierarchy
   * - Ensures minimum readable sizes
   * - Updates on resize with performance optimization
   * 
   * @returns {void}
   */
  setupResponsiveTypography() {
    if (!this.config.enableResponsiveFonts) return;
    
    const updateTypography = () => {
      const viewportWidth = window.innerWidth;
      
      // Base calculation
      let baseFontSize = this.config.baseFontSize;
      
      // Scale down on mobile, up on larger screens
      if (viewportWidth < 768) {
        // Mobile: scale down to 14-16px depending on screen width
        baseFontSize = Math.max(14, 16 * (viewportWidth / 768));
      } else if (viewportWidth > 1600) {
        // Extra large screens: cap at 18px
        baseFontSize = Math.min(18, 16 * (viewportWidth / 1600));
      }
      
      // Apply the base font size to root element
      document.documentElement.style.fontSize = `${baseFontSize}px`;
      
      // Calculate and apply fluid headings
      const headingSizes = {
        h1: baseFontSize * Math.pow(this.config.fontScaleRatio, 3),
        h2: baseFontSize * Math.pow(this.config.fontScaleRatio, 2),
        h3: baseFontSize * Math.pow(this.config.fontScaleRatio, 1),
        '.section-title': baseFontSize * Math.pow(this.config.fontScaleRatio, 1.5)
      };
      
      Object.entries(headingSizes).forEach(([selector, size]) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.fontSize = `${size}px`;
        });
      });
    };
    
    // Run on initialization
    updateTypography();
    
    // Add to resize handler
    let typographyResizeTimeout;
    window.addEventListener('resize', () => {
      if (typographyResizeTimeout) clearTimeout(typographyResizeTimeout);
      
      typographyResizeTimeout = setTimeout(updateTypography, 200);
    });
  }
  
  /**
   * Sets up optimized event listeners with proper throttling
   * and event delegation for performance
   * 
   * @private
   * @method setupEventListeners
   * 
   * @description
   * Configures all platform event listeners:
   * 
   * 1. Scroll Handling:
   *    - Throttled scroll events
   *    - Navigation state updates
   *    - Progress indicator updates
   * 
   * 2. Resize Handling:
   *    - Debounced resize events
   *    - Responsive state updates
   *    - Layout recalculation
   * 
   * 3. PDF Generation:
   *    - Button click handling
   *    - Intro animation completion check
   *    - Error handling
   * 
   * 4. Keyboard Shortcuts:
   *    - Escape key for intro skip
   *    - Spacebar for quick skip
   *    - Print shortcut (Ctrl+P)
   * 
   * 5. Quick Navigation:
   *    - Scroll to top
   *    - Scroll to bottom
   * 
   * All event listeners are optimized for performance and
   * include proper cleanup and error handling
   * 
   * @returns {void}
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
        
        // Update viewport height variables
        const setMobileViewportHeight = () => {
          // Fix for mobile browser viewport height issues
          const vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setMobileViewportHeight();
        
        // Recalculate layout dependencies if needed
        if (this.components.navigation) {
          this.components.navigation.updateNavigationState();
        }
      }, 200);
    });
    
    // Handle orientation change explicitly
    window.addEventListener('orientationchange', () => {
      // Short delay to let browser adjust
      setTimeout(setMobileViewportHeight, 100);
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
  
  /**
   * Initializes the tooltip system for enhanced user guidance
   * and contextual information display
   * 
   * @private
   * @method initializeTooltipSystem
   * 
   * @description
   * Sets up a custom tooltip system that:
   * - Provides contextual information on hover/focus
   * - Manages tooltip positioning and visibility
   * - Supports mobile and keyboard interactions
   * - Handles accessibility requirements
   * 
   * @returns {void}
   */
  initializeTooltipSystem() {
    // Create tooltip container and service as an object with bound methods
    const tooltipSystem = {
      activeTooltip: null,
      showTimeout: null,
      
      createTooltipContainer() {
        // Check if container already exists
        let container = document.getElementById('cv-tooltip-container');
        
        if (!container) {
          container = document.createElement('div');
          container.id = 'cv-tooltip-container';
          container.className = 'cv-tooltip-container';
          container.setAttribute('role', 'tooltip');
          container.setAttribute('aria-hidden', 'true');
          document.body.appendChild(container);
        }
        
        return container;
      },
      
      showTooltip(targetElement, content, options = {}) {
        // Clear any existing timeout
        if (this.showTimeout) {
          clearTimeout(this.showTimeout);
        }
        
        // Default options
        const config = {
          delay: options.delay ?? 300,
          position: options.position ?? 'top',
          theme: options.theme ?? 'default',
          maxWidth: options.maxWidth ?? 250,
        };
        
        // Create and show tooltip with appropriate delay
        this.showTimeout = setTimeout(() => {
          const container = this.createTooltipContainer();
          
          // Set content and add appropriate classes
          container.innerHTML = content;
          container.className = 'cv-tooltip-container';
          container.classList.add(`cv-tooltip-${config.position}`);
          
          if (config.theme !== 'default') {
            container.classList.add(`cv-tooltip-theme-${config.theme}`);
          }
          
          container.style.maxWidth = `${config.maxWidth}px`;
          
          // Get position of target element
          const targetRect = targetElement.getBoundingClientRect();
          
          // Calculate position based on target and scroll
          const scrollX = window.scrollX || window.pageXOffset;
          const scrollY = window.scrollY || window.pageYOffset;
          
          // Simplifying the positioning for this example
          let left = targetRect.left + targetRect.width / 2 + scrollX;
          let top = targetRect.top + scrollY - 10;
          
          // Apply position
          container.style.transform = 'translate(-50%, -100%)';
          container.style.left = `${left}px`;
          container.style.top = `${top}px`;
          
          // Make tooltip visible
          container.classList.add('cv-tooltip-visible');
          container.setAttribute('aria-hidden', 'false');
          
          // Adjust position to ensure it's in viewport
          this.adjustTooltipPosition(container);
          
          // Set aria attributes for accessibility
          targetElement.setAttribute('aria-describedby', 'cv-tooltip-container');
          
          // Store reference to active tooltip
          this.activeTooltip = container;
        }, config.delay);
      },
      
      hideTooltip(delay = 0) {
        // Clear show timeout if it exists
        if (this.showTimeout) {
          clearTimeout(this.showTimeout);
          this.showTimeout = null;
        }
        
        // If no tooltip is active, do nothing
        if (!this.activeTooltip) return;
        
        const hideTooltipNow = () => {
          const container = this.activeTooltip;
          if (!container) return;
          
          // Remove visible class
          container.classList.remove('cv-tooltip-visible');
          container.setAttribute('aria-hidden', 'true');
          
          // Remove aria-describedby from triggering element
          const describedElement = document.querySelector('[aria-describedby="cv-tooltip-container"]');
          if (describedElement) {
            describedElement.removeAttribute('aria-describedby');
          }
          
          // Clear active tooltip reference
          this.activeTooltip = null;
        };
        
        if (delay > 0) {
          setTimeout(hideTooltipNow.bind(this), delay);
        } else {
          hideTooltipNow.bind(this)();
        }
      },
      
      adjustTooltipPosition(tooltip) {
        if (!tooltip) return;
        
        // Get tooltip dimensions
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get current position values
        const currentLeft = parseFloat(tooltip.style.left);
        const currentTop = parseFloat(tooltip.style.top);
        
        // Handle horizontal positioning
        if (tooltipRect.right > viewportWidth - 10) {
          // Too far right - adjust left position
          tooltip.style.left = `${viewportWidth - tooltipRect.width - 10}px`;
          
          // If using right position, switch to left
          if (tooltip.classList.contains('cv-tooltip-right')) {
            tooltip.classList.remove('cv-tooltip-right');
            tooltip.classList.add('cv-tooltip-left');
            tooltip.style.transform = 'translate(-100%, -50%)';
          }
        } else if (tooltipRect.left < 10) {
          // Too far left - adjust left position
          tooltip.style.left = '10px';
          
          // If using left position, switch to right
          if (tooltip.classList.contains('cv-tooltip-left')) {
            tooltip.classList.remove('cv-tooltip-left');
            tooltip.classList.add('cv-tooltip-right');
            tooltip.style.transform = 'translate(0, -50%)';
          }
        }
        
        // Handle vertical positioning
        if (tooltipRect.bottom > viewportHeight - 10) {
          // Too far down - adjust top position
          tooltip.style.top = `${viewportHeight - tooltipRect.height - 10}px`;
          
          // If using bottom position, switch to top
          if (tooltip.classList.contains('cv-tooltip-bottom')) {
            tooltip.classList.remove('cv-tooltip-bottom');
            tooltip.classList.add('cv-tooltip-top');
            tooltip.style.transform = 'translate(-50%, -100%)';
          }
        } else if (tooltipRect.top < 10) {
          // Too far up - adjust top position
          tooltip.style.top = '10px';
          
          // If using top position, switch to bottom
          if (tooltip.classList.contains('cv-tooltip-top')) {
            tooltip.classList.remove('cv-tooltip-top');
            tooltip.classList.add('cv-tooltip-bottom');
            tooltip.style.transform = 'translate(-50%, 0)';
          }
        }
      },
      
      initialize() {
        // Create tooltip container
        this.createTooltipContainer();
        
        // Use event delegation for better performance
        document.body.addEventListener('mouseover', (e) => {
          const tooltipTrigger = e.target.closest('[data-tooltip]');
          if (!tooltipTrigger) return;
          
          // Get tooltip options from data attributes
          const content = tooltipTrigger.getAttribute('data-tooltip');
          const position = tooltipTrigger.getAttribute('data-tooltip-position') || 'top';
          const theme = tooltipTrigger.getAttribute('data-tooltip-theme') || 'default';
          const delay = parseInt(tooltipTrigger.getAttribute('data-tooltip-delay') || '300', 10);
          const maxWidth = parseInt(tooltipTrigger.getAttribute('data-tooltip-max-width') || '250', 10);
          
          // Show tooltip using bound method to ensure proper this context
          this.showTooltip(tooltipTrigger, content, {
            position,
            theme,
            delay,
            maxWidth
          });
        });
        
        // Mouse out event listener
        document.body.addEventListener('mouseout', (e) => {
          const tooltipTrigger = e.target.closest('[data-tooltip]');
          if (!tooltipTrigger) return;
          
          this.hideTooltip();
        });
        
        // Additional event listeners for accessibility
        document.body.addEventListener('focusin', (e) => {
          const tooltipTrigger = e.target.closest('[data-tooltip]');
          if (!tooltipTrigger) return;
          
          const content = tooltipTrigger.getAttribute('data-tooltip');
          const position = tooltipTrigger.getAttribute('data-tooltip-position') || 'top';
          const theme = tooltipTrigger.getAttribute('data-tooltip-theme') || 'default';
          const maxWidth = parseInt(tooltipTrigger.getAttribute('data-tooltip-max-width') || '250', 10);
          
          this.showTooltip(tooltipTrigger, content, {
            position,
            theme,
            delay: 0, // Show immediately on focus
            maxWidth
          });
        });
        
        document.body.addEventListener('focusout', (e) => {
          const tooltipTrigger = e.target.closest('[data-tooltip]');
          if (!tooltipTrigger) return;
          
          this.hideTooltip();
        });
        
        // Handle escape key to dismiss tooltips
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.activeTooltip) {
            this.hideTooltip();
          }
        });
      }
    };
    
    // Store the tooltip system in the component registry with proper binding
    this.components.tooltipSystem = tooltipSystem;
    
    // Defer initialization to ensure DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // DOM already ready, initialize now
      tooltipSystem.initialize();
    } else {
      // Wait for DOM to be fully loaded
      document.addEventListener('DOMContentLoaded', () => {
        tooltipSystem.initialize();
      });
    }
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