"use client";
import { useEffect } from "react";
import { useCommission } from "@/hooks/useCommission";
import { CustomerStep } from "../steps/CustomerStep";
import { InstructionsStep } from "../steps/InstructionsStep";
import { PackageStep } from "../steps/PackageStep";
import { PortraitStep } from "../steps/PortraitStep";
import { PhotoStep } from "../steps/PhotoStep";
import { ReviewStep } from "../steps/ReviewStep";
import type { CommissionContextType } from "@/types/commission";
import { getArtwork } from "@/services/gallery";
import type { CommissionPackage } from "@/data/commissionPackages";
import { commissionWizardStyles } from "./CommissionWizard.styles";
interface CommissionWizardProps { selectedPackage: CommissionPackage; fromGallery?: boolean; artworkId?: string; freshStart?: boolean; }
export function CommissionWizard({ selectedPackage, fromGallery=false, artworkId, freshStart=false }: CommissionWizardProps) {
  const commission = useCommission({ scope: fromGallery ? `gallery-${artworkId ?? "unknown"}` : `package-${selectedPackage.id}`, fresh: freshStart });
  useEffect(() => { if (freshStart) { commission.resetForm(); } commission.updateFormData({ package: selectedPackage.id, portrait: { ...commission.formData.portrait, size: selectedPackage.size }, ...(freshStart ? { galleryArtwork: undefined } : {}) }); }, [freshStart, fromGallery, artworkId, selectedPackage.id, selectedPackage.size]);
  useEffect(() => { if (!fromGallery || !artworkId) return; void getArtwork(artworkId).then((artwork) => { const image=artwork?.images?.[0]??artwork?.image; if(!artwork||!image?.secureUrl)return; commission.updateFormData({galleryArtwork:{id:artwork.id,title:artwork.title,imageUrl:image.secureUrl,publicId:image.publicId}}); }).catch((error)=>console.warn("Gallery artwork reference could not be loaded:",error)); },[artworkId,fromGallery]);
  useEffect(() => { if(fromGallery)return; if(commission.formData.package!==selectedPackage.id||commission.formData.portrait.size!==selectedPackage.size){ commission.updateFormData({package:selectedPackage.id,galleryArtwork:undefined,portrait:{...commission.formData.portrait,size:selectedPackage.size}}); } },[fromGallery,selectedPackage,commission.formData.package,commission.formData.portrait.size]);
  const renderStep=(context:CommissionContextType)=>{switch(context.steps[context.currentStep].id){case "package":return <PackageStep commission={context} fromGallery={fromGallery}/>;case "customer":return <CustomerStep commission={context}/>;case "portrait":return <PortraitStep commission={context} fromGallery={fromGallery}/>;case "photos":return <PhotoStep commission={context}/>;case "instructions":return <InstructionsStep commission={context}/>;case "review":return <ReviewStep commission={context}/>;default:return null;}};
  return <div className={commissionWizardStyles.wrapper}><div className="rounded-3xl bg-black p-4 shadow-2xl sm:p-6 lg:p-8">{renderStep(commission)}</div></div>;
}
