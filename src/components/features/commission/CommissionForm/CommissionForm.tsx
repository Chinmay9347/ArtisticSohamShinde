"use client";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { commissionFormStyles as styles } from "./CommissionForm.styles";

export function CommissionForm() {
    const [files, setFiles] = useState<File[]>([]);

    const handleFilesChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = event.target.files;

      if (!files) return;

      setFiles((prev) => [
        ...prev,
        ...Array.from(files),
      ]);
    };
    // const handleFiles = (
    // event: React.ChangeEvent<HTMLInputElement>
    // ) => {
    // if (!event.target.files) return;

    // setFiles((prev) => [
    //     ...prev,
    //     ...Array.from(event.target.files),
    // ]);
    // };

    const removeFile = (index: number) => {
    setFiles((prev) =>
        prev.filter((_, i) => i !== index)
    );
    };
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <h2 className={styles.heading}>
          Start Your Commission
        </h2>

        <p className={styles.subtitle}>
          Fill in the details below. You'll be able to upload your reference
          photos in the next step as we continue developing the website.
        </p>

        <form className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>
                Full Name
              </label>

               <input
                type="text"
                placeholder="Enter your full name"
                className={styles.input}
              /> 
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Phone Number
              </label>

              <input
                type="tel"
                placeholder="Enter your phone number"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Portrait Type
              </label>

              <select className={styles.select}>
                <option>Single Portrait</option>
                <option>Couple Portrait</option>
                <option>Family Portrait</option>
                <option>Friends Portrait</option>
                <option>Pet Portrait</option>
                <option>Custom Portrait</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Portrait Size
              </label>

              <select className={styles.select}>
                <option>A5</option>
                <option>A4</option>
                <option>A3</option>
                <option>A2</option>
                <option>Custom Size</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Number of Subjects
              </label>

              <input
                type="number"
                min="1"
                defaultValue={1}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Special Instructions
            </label>

            <textarea
              placeholder="Tell me about your portrait, preferred background, deadlines, gift occasion, or any other details..."
              className={styles.textarea}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
                Reference Photos
            </label>

            <div className={styles.uploadArea}>
                <Upload
                size={42}
                className={styles.uploadIcon}
                />

                <h3 className={styles.uploadTitle}>
                Upload Your Reference Photos
                </h3>

                <p className={styles.uploadSubtitle}>
                JPG, PNG or WEBP • Multiple images supported
                </p>

                <label className={styles.uploadButton}>
                Choose Files

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={handleFilesChange}
                />
                {/* <input
                    type="file"
                    multiple
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={handleFiles}
                /> */}
                </label>
            </div>

            {files.length > 0 && (
                <div className={styles.fileList}>
                {files.map((file, index) => (
                    <div
                    key={`${file.name}-${index}`}
                    className={styles.fileItem}
                    >
                    <span className={styles.fileName}>
                        📷 {file.name}
                    </span>

                    <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeFile(index)}
                    >
                        <X size={18} />
                    </button>
                    </div>
                ))}
                </div>
            )}
            </div>

          <button
            type="submit"
            className={styles.submit}
          >
            Continue Commission Request
          </button>
        </form>
      </Container>
    </Section>
  );
}