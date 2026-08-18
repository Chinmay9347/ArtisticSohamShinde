"use client";

import { useMemo, useState } from "react";

import { upsertPricingConfig } from "@/services/pricing";

import type {
  PricingConfigDocument,
} from "@/types/pricing";

import { pricingManagerStyles as styles } from "./PricingManager.styles";
import type {
  PricingManagerProps,
} from "./PricingManagerNew.types";

/**
 * Admin Pricing Manager
 *
 * PHASE A1
 *
 * Responsibilities in this first version:
 * - Display available pricing packages.
 * - Allow the admin to select a package.
 * - Display editable pricing fields.
 * - Keep edits locally in component state.
 *
 * NOT implemented yet:
 * - Firestore save.
 * - Customer commission integration.
 * - Server-side order recalculation.
 * - Offers.
 * - Referral discounts.
 *
 * Those will be implemented in later phases.
 */
export function PricingManager({
  initialConfigs,
}: PricingManagerProps) {
  /**
   * Keep a local copy of the pricing configurations.
   *
   * We intentionally do not mutate the original prop.
   */
  const [configs, setConfigs] =
    useState<PricingConfigDocument[]>(
      initialConfigs,
    );

  /**
   * Currently selected package.
   *
   * Default to the first available package.
   */
  const [selectedPackageId, setSelectedPackageId] =
    useState<string>(
      initialConfigs[0]?.packageId ?? "",
    );

  /**
   * Find the currently selected configuration.
   */
  const selectedConfig = useMemo(
    () =>
      configs.find(
        (config) =>
          config.packageId ===
          selectedPackageId,
      ),
    [configs, selectedPackageId],
  );

  /**
   * Package selected as the source for the copy-pricing tool.
   *
   * This is intentionally independent from the package currently being
   * edited so an admin can copy from any package to any other package.
   */
  const [copySourcePackageId, setCopySourcePackageId] =
    useState<string>(initialConfigs[0]?.packageId ?? "");

  /**
   * Package that receives the copied prices.
   * Default to the second package when available to avoid an accidental
   * self-copy.
   */
  const [copyTargetPackageId, setCopyTargetPackageId] =
    useState<string>(
      initialConfigs[1]?.packageId ?? initialConfigs[0]?.packageId ?? "",
    );

  /**
   * Percentage increase applied to the source prices before copying.
   * Example: 10 means source price + 10%.
   */
  const [copyPercentage, setCopyPercentage] = useState<string>("0");

  const [copyMessage, setCopyMessage] = useState<string>("");

  const copySourceConfig = useMemo(
    () =>
      configs.find(
        (config) => config.packageId === copySourcePackageId,
      ),
    [configs, copySourcePackageId],
  );

  const copyTargetConfig = useMemo(
    () =>
      configs.find(
        (config) => config.packageId === copyTargetPackageId,
      ),
    [configs, copyTargetPackageId],
  );

  /**
   * Copy all numeric pricing values from one package to another and apply
   * the requested percentage increase.
   *
   * Only prices are copied. Package metadata such as name, size, dimensions,
   * and enabled state remain unchanged. Changes are local until the target
   * package is saved with the normal Save Changes button.
   */
  const handleCopyPrices = () => {
    if (!copySourceConfig || !copyTargetConfig) {
      setCopyMessage("Select a source and target package.");
      return;
    }

    if (
      copySourceConfig.packageId ===
      copyTargetConfig.packageId
    ) {
      setCopyMessage("Source and target packages must be different.");
      return;
    }

    const percentage = Number(copyPercentage);

    if (!Number.isFinite(percentage) || percentage < 0) {
      setCopyMessage("Enter a valid percentage increase of 0 or more.");
      return;
    }

    const multiplier = 1 + percentage / 100;

    const applyIncrease = (value: number) =>
      Math.round(value * multiplier);

    setConfigs((current) =>
      current.map((config) => {
        if (config.packageId !== copyTargetConfig.packageId) {
          return config;
        }

        return {
          ...config,
          prices: {
            sketched: applyIncrease(copySourceConfig.prices.sketched),
            framed: applyIncrease(copySourceConfig.prices.framed),
            digital: applyIncrease(copySourceConfig.prices.digital),
            premiumFrame: applyIncrease(
              copySourceConfig.prices.premiumFrame,
            ),
          },
          subjectPrices: {
            1: applyIncrease(copySourceConfig.subjectPrices[1]),
            2: applyIncrease(copySourceConfig.subjectPrices[2]),
            3: applyIncrease(copySourceConfig.subjectPrices[3]),
            4: applyIncrease(copySourceConfig.subjectPrices[4]),
          },
        };
      }),
    );

    setSelectedPackageId(copyTargetConfig.packageId);
    setCopyMessage(
      `Prices copied from ${copySourceConfig.packageName} to ${copyTargetConfig.packageName} with a ${percentage}% increase.`,
    );
  };

  /**
   * Update a price field locally.
   *
   * Firestore persistence will be added in the next step.
   */
  const updatePrice = (
    field:
      | "sketched"
      | "framed"
      | "digital"
      | "premiumFrame",
    value: string,
  ) => {
    if (!selectedConfig) {
      return;
    }

    const numericValue =
      Number(value);

    setConfigs((current) =>
      current.map((config) => {
        if (
          config.packageId !==
          selectedPackageId
        ) {
          return config;
        }

        return {
          ...config,

          prices: {
            ...config.prices,
            [field]:
              Number.isFinite(
                numericValue,
              )
                ? numericValue
                : 0,
          },
        };
      }),
    );
  };

  /**
   * Update subject pricing locally.
   */
  const updateSubjectPrice = (
    subject:
      | 1
      | 2
      | 3
      | 4,
    value: string,
  ) => {
    if (!selectedConfig) {
      return;
    }

    const numericValue =
      Number(value);

    setConfigs((current) =>
      current.map((config) => {
        if (
          config.packageId !==
          selectedPackageId
        ) {
          return config;
        }

        return {
          ...config,

          subjectPrices: {
            ...config.subjectPrices,
            [subject]:
              Number.isFinite(
                numericValue,
              )
                ? numericValue
                : 0,
          },
        };
      }),
    );
  };

  /**
   * Update package enabled state locally.
   */
  const updateEnabled = (
    enabled: boolean,
  ) => {
    setConfigs((current) =>
      current.map((config) =>
        config.packageId ===
        selectedPackageId
          ? {
              ...config,
              enabled,
            }
          : config,
      ),
    );
  };

  /**
   * Temporary save handler.
   *
   * IMPORTANT:
   * We intentionally do not call Firestore yet.
   *
   * The next step will connect this to:
   *
   * upsertPricingConfig()
   */
  // const handleSave = () => {
  //   if (!selectedConfig) {
  //     return;
  //   }

  //   console.log(
  //     "Pricing configuration ready to save:",
  //     selectedConfig,
  //   );
  // };

  /**
   * Save the currently selected pricing configuration.
   *
   * IMPORTANT:
   * - Only the selected package is saved.
   * - Firestore uses merge semantics.
   * - We do not overwrite other packages.
   * - The local state remains the source for the current UI.
   */
  const [isSaving, setIsSaving] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState<string>("");

  const handleSave = async () => {
    if (!selectedConfig || isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      setSaveMessage("");

      await upsertPricingConfig(
        selectedConfig.packageId,
        {
          packageId:
            selectedConfig.packageId,

          packageName:
            selectedConfig.packageName,

          size:
            selectedConfig.size,

          dimensions:
            selectedConfig.dimensions,

          prices: {
            ...selectedConfig.prices,
          },

          subjectPrices: {
            ...selectedConfig.subjectPrices,
          },

          enabled:
            selectedConfig.enabled,
        },
      );

      setSaveMessage(
        "Pricing changes saved successfully.",
      );
    } catch (error) {
      console.error(
        "Failed to save pricing configuration:",
        error,
      );

      setSaveMessage(
        "Failed to save pricing changes.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!selectedConfig) {
    return (
      <div
        className={
          styles.container
        }
      >
        <p className="text-neutral-500">
          No pricing configuration
          available.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        styles.container
      }
    >
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div
        className={
          styles.header
        }
      >
        <h1
          className={
            styles.title
          }
        >
          Pricing Management
        </h1>

        <p
          className={
            styles.description
          }
        >
          Manage commission pricing
          for each package.
        </p>
      </div>

      {/* =====================================================
          PACKAGE SELECTOR
          ===================================================== */}

      <div
        className={
          styles.packageGrid
        }
      >
        {configs.map(
          (config) => {
            const active =
              config.packageId ===
              selectedPackageId;

            return (
              <button
                key={
                  config.packageId
                }
                type="button"
                className={
                  active
                    ? styles.packageButtonActive
                    : styles.packageButton
                }
                onClick={() =>
                  setSelectedPackageId(
                    config.packageId,
                  )
                }
              >
                <div
                  className={
                    styles.packageName
                  }
                >
                  {
                    config.packageName
                  }
                </div>

                <div
                  className={
                    styles.packageSize
                  }
                >
                  {config.size}
                </div>
              </button>
            );
          },
        )}
      </div>

      {/* =====================================================
          COPY PRICING
          ===================================================== */}

      <section
        className={
          styles.section
        }
      >
        <div>
          <h2
            className={
              styles.sectionTitle
            }
          >
            Copy Pricing
          </h2>

          <p
            className={
              styles.sectionDescription
            }
          >
            Copy all fulfillment and subject prices from one package to
            another and optionally increase them by a percentage.
          </p>
        </div>

        <div
          className={
            styles.copyGrid
          }
        >
          <div
            className={
              styles.field
            }
          >
            <label
              htmlFor="copy-source-package"
              className={
                styles.label
              }
            >
              Copy From
            </label>

            <select
              id="copy-source-package"
              value={
                copySourcePackageId
              }
              onChange={(event) => {
                setCopySourcePackageId(
                  event.target.value,
                );
                setCopyMessage("");
              }}
              className={
                styles.input
              }
            >
              {configs.map((config) => (
                <option
                  key={config.packageId}
                  value={config.packageId}
                >
                  {config.packageName} ({config.size})
                </option>
              ))}
            </select>
          </div>

          <div
            className={
              styles.field
            }
          >
            <label
              htmlFor="copy-target-package"
              className={
                styles.label
              }
            >
              Copy To
            </label>

            <select
              id="copy-target-package"
              value={
                copyTargetPackageId
              }
              onChange={(event) => {
                setCopyTargetPackageId(
                  event.target.value,
                );
                setCopyMessage("");
              }}
              className={
                styles.input
              }
            >
              {configs.map((config) => (
                <option
                  key={config.packageId}
                  value={config.packageId}
                >
                  {config.packageName} ({config.size})
                </option>
              ))}
            </select>
          </div>

          <div
            className={
              styles.field
            }
          >
            <label
              htmlFor="copy-percentage"
              className={
                styles.label
              }
            >
              Increase Price (%)
            </label>

            <input
              id="copy-percentage"
              type="number"
              min="0"
              step="0.1"
              value={
                copyPercentage
              }
              onChange={(event) => {
                setCopyPercentage(
                  event.target.value,
                );
                setCopyMessage("");
              }}
              className={
                styles.input
              }
              placeholder="e.g. 10"
            />
          </div>

          <div
            className={
              styles.copyAction
            }
          >
            <button
              type="button"
              className={
                styles.copyButton
              }
              onClick={
                handleCopyPrices
              }
              disabled={configs.length < 2}
            >
              Copy Prices
            </button>
          </div>
        </div>

        {copyMessage && (
          <p
            className={
              styles.copyMessage
            }
          >
            {copyMessage}
          </p>
        )}
      </section>

      {/* =====================================================
          FULFILLMENT PRICING
          ===================================================== */}

      <section
        className={
          styles.section
        }
      >
        <div>
          <h2
            className={
              styles.sectionTitle
            }
          >
            Fulfillment Pricing
          </h2>

          <p
            className={
              styles.sectionDescription
            }
          >
            Set the base price for
            each fulfillment method.
          </p>
        </div>

        <div
          className={
            styles.grid
          }
        >
          <div
            className={
              styles.field
            }
          >
            <label
              className={
                styles.label
              }
            >
              Sketched Portrait
            </label>

            <input
              type="number"
              min="0"
              value={
                selectedConfig
                  .prices
                  .sketched
              }
              onChange={(event) =>
                updatePrice(
                  "sketched",
                  event.target
                    .value,
                )
              }
              className={
                styles.input
              }
            />
          </div>

          <div
            className={
              styles.field
            }
          >
            <label
              className={
                styles.label
              }
            >
              Framed Portrait
            </label>

            <input
              type="number"
              min="0"
              value={
                selectedConfig
                  .prices
                  .framed
              }
              onChange={(event) =>
                updatePrice(
                  "framed",
                  event.target
                    .value,
                )
              }
              className={
                styles.input
              }
            />
          </div>

          <div
            className={
              styles.field
            }
          >
            <label
              className={
                styles.label
              }
            >
              Digital Download
            </label>

            <input
              type="number"
              min="0"
              value={
                selectedConfig
                  .prices
                  .digital
              }
              onChange={(event) =>
                updatePrice(
                  "digital",
                  event.target
                    .value,
                )
              }
              className={
                styles.input
              }
            />
          </div>

          <div
            className={
              styles.field
            }
          >
            <label
              className={
                styles.label
              }
            >
              Premium Frame
            </label>

            <input
              type="number"
              min="0"
              value={
                selectedConfig
                  .prices
                  .premiumFrame
              }
              onChange={(event) =>
                updatePrice(
                  "premiumFrame",
                  event.target
                    .value,
                )
              }
              className={
                styles.input
              }
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          SUBJECT PRICING
          ===================================================== */}

      <section
        className={
          styles.section
        }
      >
        <div>
          <h2
            className={
              styles.sectionTitle
            }
          >
            Extra Subject Pricing
          </h2>

          <p
            className={
              styles.sectionDescription
            }
          >
            Set the total subject-based
            pricing values for this
            package.
          </p>
        </div>

        <div
          className={
            styles.grid
          }
        >
          {[1, 2, 3, 4].map(
            (subject) => (
              <div
                key={subject}
                className={
                  styles.field
                }
              >
                <label
                  className={
                    styles.label
                  }
                >
                  {subject}{" "}
                  {subject === 1
                    ? "Subject"
                    : "Subjects"}
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    selectedConfig
                      .subjectPrices[
                      subject as
                        1 | 2 | 3 | 4
                    ]
                  }
                  onChange={(
                    event,
                  ) =>
                    updateSubjectPrice(
                      subject as
                        | 1
                        | 2
                        | 3
                        | 4,
                      event.target
                        .value,
                    )
                  }
                  className={
                    styles.input
                  }
                />
              </div>
            ),
          )}
        </div>
      </section>

      {/* =====================================================
          PACKAGE STATUS
          ===================================================== */}

      <section
        className={
          styles.section
        }
      >
        <div>
          <h2
            className={
              styles.sectionTitle
            }
          >
            Package Status
          </h2>

          <p
            className={
              styles.sectionDescription
            }
          >
            Control whether this
            package is available to
            customers.
          </p>
        </div>

        <label
          className={
            styles.checkboxRow
          }
        >
          <input
            type="checkbox"
            checked={
              selectedConfig.enabled
            }
            onChange={(event) =>
              updateEnabled(
                event.target
                  .checked,
              )
            }
            className={
              styles.checkbox
            }
          />

          <span className="text-sm text-neutral-700">
            Available for customers
          </span>
        </label>
      </section>

      {/* =====================================================
          SAVE
          ===================================================== */}

      <div
        className={
          styles.actions
        }
      >
        <div className="flex items-center gap-4">
          {saveMessage && (
            <p className="text-sm text-neutral-600">
              {saveMessage}
            </p>
          )}

          <button
            type="button"
            className={
              styles.saveButton
            }
            onClick={
              handleSave
            }
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}