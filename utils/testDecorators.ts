import { test } from '@playwright/test';
import { allure } from 'allure-playwright';
import { Severity } from 'allure-js-commons';

/**
 * Unified test decorator utility that provides a single interface for adding metadata
 * to both Playwright and Allure test reporters.
 * 
 * This class centralizes test metadata management, ensuring consistent reporting
 * across different test reporters (Playwright HTML report and Allure).
 * 
 * @example
 * ```typescript
 * test.describe('User Registration', async () => {
 *   await TestDecorators.setupTestDescribe({
 *     suite: 'Authentication',
 *     suiteDescription: 'User authentication and registration tests',
 *     epic: 'User Management',
 *     feature: 'User Registration'
 *   });
 * 
 *   test('TC 001 Register new user', async () => {
 *     await TestDecorators.setupTest({
 *       description: 'Verify successful user registration with valid data',
 *       owner: 'QA Team',
 *       severity: 'critical',
 *       story: 'User can register with valid credentials',
 *       tms: 'TMS-123',
 *       issue: 'JIRA-456'
 *     });
 *   });
 * });
 * ```
 */
export class TestDecorators {

    private static getAnnotationValue(type: string): string | undefined {
        const annotation = test.info().annotations.find(ann => ann.type === type);
        return annotation?.description;
    }

    /**
   * Add a detailed description to the test.
   * Adds metadata to both Playwright test info and Allure report.
   * 
   * @param text - The description text
   * @example
   * ```typescript
   * await TestDecorators.description('Verify user can login with valid credentials');
   * ```
   */
    static async description(text: string): Promise<void> {
        test.info().annotations.push({ type: 'Description', description: text });
        allure.description(text);

        // Hack to concat suite description and test description in Allure
        const suiteDescription = this.getAnnotationValue('Suite Description');
        let fullDescription: string;

        if (suiteDescription !== undefined) {
            fullDescription = `Suite Description:\n${suiteDescription}\n\nTest Case Description:\n${text}`;
        } else {
            fullDescription = `Test Case Description:\n${text}`;
        }

        allure.description(fullDescription);
    }

    /**
     * Assign an owner/responsible person to the test.
     * 
     * @param owner - The owner's name or team
     * @example
     * ```typescript
     * await TestDecorators.owner('QA Team');
     * await TestDecorators.owner('John Doe');
     * ```
     */
    static async owner(owner: string): Promise<void> {
        test.info().annotations.push({ type: 'Owner', description: owner });
        allure.owner(owner);
    }

    /**
     * Set the severity level of the test.
     * 
     * @param severity - Severity level: blocker, critical, normal, minor, or trivial
     * @example
     * ```typescript
     * await TestDecorators.severity('critical');
     * ```
     */
    static async severity(severity: Severity): Promise<void> {
        test.info().annotations.push({ type: 'Severity', description: severity });
        allure.severity(severity);
    }

    /**
     * Assign the test to an epic (highest level of hierarchy).
     * 
     * @param epic - Epic name
     * @example
     * ```typescript
     * await TestDecorators.epic('User Management');
     * ```
     */
    static async epic(epic: string): Promise<void> {
        test.info().annotations.push({ type: 'Epic', description: epic });
        allure.epic(epic);
    }

    /**
     * Assign the test to a feature (mid-level of hierarchy).
     * 
     * @param feature - Feature name
     * @example
     * ```typescript
     * await TestDecorators.feature('User Registration');
     * ```
     */
    static async feature(feature: string): Promise<void> {
        test.info().annotations.push({ type: 'Feature', description: feature });
        allure.feature(feature);
    }

    /**
     * Assign the test to a user story (lowest level of hierarchy).
     * 
     * @param story - Story name or description
     * @example
     * ```typescript
     * await TestDecorators.story('As a user, I want to register an account');
     * ```
     */
    static async story(story: string): Promise<void> {
        test.info().annotations.push({ type: 'Story', description: story });
        allure.story(story);
    }

    /**
     * Link the test to a Test Management System (TMS) test case.
     * 
     * @param id - TMS test case ID
     * @param url - Optional URL to the TMS test case
     * @example
     * ```typescript
     * await TestDecorators.tms('TMS-12345');
     * await TestDecorators.tms('TMS-12345', 'https://tms.example.com/test/12345');
     * ```
     */
    static async tms(id: string, url: string): Promise<void> {
        test.info().annotations.push({
            type: 'TMS',
            description: `${id} - ${url}`
        });
        allure.tms(id, url);
    }

    /**
     * Link the test to a bug tracking system issue.
     * 
     * @param id - Issue ID (e.g., JIRA ticket)
     * @param url - Optional URL to the issue
     * @example
     * ```typescript
     * await TestDecorators.issue('JIRA-12345', 'https://jira.example.com/browse/JIRA-12345');
     * ```
     */
    static async issue(id: string, url: string): Promise<void> {
        test.info().annotations.push({
            type: 'Issue',
            description: `${id} - ${url}`
        });

        allure.issue(id, url);
    }

    /**
     * Set the test suite name.
     * 
     * @param suite - Suite name
     * @example
     * ```typescript
     * await TestDecorators.suite('Authentication Tests');
     * ```
     */
    static async suite(suite: string): Promise<void> {
        test.info().annotations.push({ type: 'suite', description: suite });
        allure.suite(suite);
    }

    /**
     * Add a description to the test suite.
     * 
     * @param text - Suite description
     * @example
     * ```typescript
     * await TestDecorators.suiteDescription('Comprehensive tests for user authentication flows');
     * ```
     */
    static async suiteDescription(text: string): Promise<void> {
        await test.step(`📄 Suite Description: ${text}`, async () => {
            test.info().annotations.push({ type: 'Suite Description', description: text });

            // Allure annotation - skipped, is handled in description() method
        });
    }

    /**
     * Setup multiple metadata fields for a test describe block at once.
     * This is a convenience method to set suite-level metadata.
     * 
     * @param config - Configuration object with metadata fields
     * @example
     * ```typescript
     * test.describe('User Registration', async () => {
     *   await TestDecorators.setupTestDescribe({
     *     suite: 'Authentication',
     *     suiteDescription: 'User authentication and registration tests',
     *     epic: 'User Management',
     *     feature: 'User Registration'
     *   });
     * });
     * ```
     */
    static async setupTestDescribe(config: {
        suite?: string;
        suiteDescription?: string;
        epic?: string;
        feature?: string;
        story?: string;
    }): Promise<void> {
        test.beforeEach(async () => {
            if (config.suiteDescription) {
                await this.suiteDescription(config.suiteDescription);
            }
            if (config.suite) {
                await this.suite(config.suite);
            }
            if (config.epic) {
                await this.epic(config.epic);
            }
            if (config.feature) {
                await this.feature(config.feature);
            }
            if (config.story) {
                await this.story(config.story);
            }
        });
    }

    /**
     * Setup multiple metadata fields for an individual test at once.
     * This is a convenience method to configure all test metadata in one call.
     * 
     * @param config - Configuration object with metadata fields
     * @example
     * ```typescript
     * test('TC 001 Login with valid credentials', async () => {
     *   await TestDecorators.setupTest({
     *     description: 'Verify user can login with valid username and password',
     *     owner: 'QA Team',
     *     severity: 'critical',
     *     story: 'User login functionality',
     *     tms: 'TMS-123',
     *     issue: 'JIRA-456',
     *     knownBugs: [{ issue: 'BUG-789', description: 'Login fails on Safari' }]
     *   });
     * });
     * ```
     */
    static async setupTest(config: {
        description?: string;
        owner?: string;
        severity?: Severity;
        tms?: { id: string; url: string };
        knownBugs?: { bugId: string; environments?: string[]}[]
    }): Promise<void> {
        if (config.description) {
            await this.description(config.description);
        }

        if (config.owner) {
            await this.owner(config.owner);
        }

        if (config.tms) {
            await this.tms(config.tms.id, config.tms.url);
        }

        if  (config.knownBugs && config.knownBugs.length > 0) {
            await this.markKnownBugs(config.knownBugs);
        }
    }

    /**
     * Mark multiple known bugs associated with the test.
     * This helps track tests that are expected to fail due to known issues.
     * 
     * @param bugs - Array of bug objects with issue ID, description, and optional URL
     * @example
     * ```typescript
     * await TestDecorators.markKnownBugs([
     *   { issue: 'BUG-123', description: 'Login fails on Safari', url: 'https://jira.example.com/BUG-123' },
     *   { issue: 'BUG-456', description: 'Slow response time' }
     * ]);
     * ```
     */
    static async markKnownBugs(knownBugs: { bugId: string; environments?: string[]}[]): Promise<void> {
        /*for (const bug of knownBugs) {
            await this.markSingleKnownBug(bug.bugId, undefined, undefined);
        }*/
       const currentEnv = process.env.ENV || 'local';

       for (const bug of knownBugs) {
        // If no environments specified, mark the bug for all environments
            if (!bug.environments || bug.environments.length === 0 ) {
                await this.markSingleKnownBug(bug.bugId, 'all environments');
                continue;
            }

            // Check if current environment is in the bug's environments list
            const isCurrentEnvAffected = bug.environments.some(env => 
                env.toLowerCase() === currentEnv.toLowerCase()
            );

            if (isCurrentEnvAffected) {
                await this.markSingleKnownBug(bug.bugId, bug.environments.join(', '));
            }
        }
    }

    /**
     * Mark a single known bug associated with the test.
     * 
     * @param issue - Bug/issue ID
     * @param description - Optional description of the bug
     * @param url - Optional URL to the bug report
     * @private
     */
    private static async markSingleKnownBug(
        bugId: string,
        environments: string
    ): Promise<void> {
        // Create issue link
        const bugUrl = `https://your-bug-tracker.com/browse/${bugId}`;
        await allure.issue(bugId, bugUrl);

        // Add to test description
        await allure.tag(`Known Bug: ${bugId})`);

        console.log(` Known Bug Marked: ${bugId} - Affects ${environments} - Current Env: ${process.env.ENV}`);
        console.warn(` Warning! This test has been marked as 'known bug'. The outcome of the test will be overridden.`);
        console.warn(`If the bug is fixed, please remove the 'knownBugs' section to ensure the test is properly validated.`);

        const bugDescription = `This test has been reported as failing by known bug: ${bugId}. Bug link: ${bugUrl}`;
        const failDescription = `This test has been marked as 'known issue'. The outcome of the test will be overridden.` 

        test.info().fail(true, failDescription);
        test.info().annotations.push({ type: `Known Bug ${bugId}`, description: bugDescription });
    }
}

export const TestSeverity = Severity;

export interface TestDescribeConfig {
    suite?: string;
    suiteDescription?: string;
    epic?: string;
    feature?: string;
    story?: string;
}

export interface TestConfig {
    description?: string;
    owner?: string;
    severity?: Severity;
    tms?: { id: string; url: string };
    knownBugs?: { bugId: string; environments?: string[]}[]
}