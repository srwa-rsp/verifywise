import { Request, Response } from "express";

import { STATUS_CODE } from "../utils/statusCode.utils";
import {
  createNewVendorQuery,
  deleteVendorByIdQuery,
  getAllVendorsQuery,
  getVendorByIdQuery,
  updateVendorByIdQuery,
} from "../utils/vendor.utils";
import { Vendor } from "../models/vendor.model";

export async function getAllVendors(req: Request, res: Response): Promise<any> {
  try {
    const vendors = await getAllVendorsQuery();

    if (vendors) {
      return res.status(200).json(STATUS_CODE[200](vendors));
    }

    return res.status(204).json(STATUS_CODE[204](vendors));
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function getVendorById(req: Request, res: Response): Promise<any> {
  try {
    const vendorId = parseInt(req.params.id);

    const vendor = await getVendorByIdQuery(vendorId);

    if (vendor) {
      return res.status(200).json(STATUS_CODE[200](vendor));
    }

    return res.status(404).json(STATUS_CODE[404](vendor));
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function createVendor(req: Request, res: Response): Promise<any> {
  try {
    const newVendor: Vendor = req.body;

    if (!newVendor.vendor_name || !newVendor.vendor_provides) {
      return res.status(400).json(
        STATUS_CODE[400]({
          message: "vendorName and vendorProvides are required",
        })
      );
    }

    const createdVendor = await createNewVendorQuery(newVendor);

    if (createdVendor) {
      return res.status(201).json(STATUS_CODE[201](createdVendor));
    }

    return res.status(503).json(STATUS_CODE[503]({}));
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function updateVendorById(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const vendorId = parseInt(req.params.id);
    const updatedVendor: Vendor = req.body;

    if (!updatedVendor.vendor_name || !updatedVendor.vendor_provides) {
      return res.status(400).json(
        STATUS_CODE[400]({
          message: "vendorName and vendorProvides are required",
        })
      );
    }

    const vendor = await updateVendorByIdQuery(vendorId, updatedVendor);

    if (vendor) {
      return res.status(202).json(STATUS_CODE[202](vendor));
    }

    return res.status(404).json(STATUS_CODE[404]({}));
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}

export async function deleteVendorById(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const vendorId = parseInt(req.params.id);

    const deletedVendor = await deleteVendorByIdQuery(vendorId);

    if (deletedVendor) {
      return res.status(202).json(STATUS_CODE[202](deletedVendor));
    }

    return res.status(404).json(STATUS_CODE[404]({}));
  } catch (error) {
    return res.status(500).json(STATUS_CODE[500]((error as Error).message));
  }
}
