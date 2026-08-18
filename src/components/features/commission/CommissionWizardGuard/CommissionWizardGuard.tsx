"use client";
import { CommissionWizard } from "../CommissionWizard";
import type { CommissionPackage } from "@/data/commissionPackages";
interface Props { selectedPackage: CommissionPackage; fromGallery?: boolean; artworkId?: string; freshStart?: boolean; }
export function CommissionWizardGuard({selectedPackage,fromGallery=false,artworkId,freshStart=false}:Props){return <CommissionWizard selectedPackage={selectedPackage} fromGallery={fromGallery} artworkId={artworkId} freshStart={freshStart}/>;}
